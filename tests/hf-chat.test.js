// Mocked tests for api/hf-chat.js: no network, no API quota. Run with `npm test`.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const LEAK = /chatcmpl|usage|system_fingerprint|x_groq|req_01|prompt_tokens/;
const emptyLength = {
  id: 'chatcmpl-abc',
  choices: [{ message: { role: 'assistant', content: '' }, finish_reason: 'length' }],
  usage: { prompt_tokens: 72 },
  system_fingerprint: 'fp_x',
  x_groq: { id: 'req_01x' },
};
const ok = (t) => ({ id: 'chatcmpl-ok', choices: [{ message: { content: t }, finish_reason: 'stop' }], usage: { prompt_tokens: 1 } });
const reply = (status, body, headers = {}) => new Response(JSON.stringify(body), { status, headers });

let handler;
let ipN = 0;
const logs = [];
const saved = {};

before(async () => {
  Object.assign(saved, { fetch: globalThis.fetch, error: console.error, warn: console.warn, env: { ...process.env } });
  process.env.GROQ_API_KEY = 'test-key';
  for (const k of ['HUGGINGFACE_API_KEY', 'VITE_HUGGINGFACE_API_KEY', 'UPSTASH_REDIS_REST_URL', 'KV_REST_API_URL']) delete process.env[k];
  console.error = (...a) => logs.push(a.join(' '));
  console.warn = (...a) => logs.push(a.join(' '));
  ({ default: handler } = await import('../api/hf-chat.js'));
});

after(() => {
  globalThis.fetch = saved.fetch;
  console.error = saved.error;
  console.warn = saved.warn;
  process.env = saved.env;
});

/** Calls the handler with queued upstream responses; each call uses a fresh client IP. */
async function call(queue, body = { inputs: 'hi', parameters: { max_new_tokens: 16 } }, ip = `10.0.0.${++ipN}`) {
  const sent = [];
  globalThis.fetch = async (_url, init) => {
    sent.push(JSON.parse(init.body));
    const next = queue.shift();
    if (next instanceof Error) throw next;
    return next;
  };
  const res = {
    statusCode: 0,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(c) { this.statusCode = c; return this; },
    json(b) { this.body = b; return this; },
  };
  await handler({ method: 'POST', headers: { origin: 'http://localhost:5173', 'x-forwarded-for': ip }, body }, res);
  return { res, sent };
}

test('empty "length" reply is retried once at the 400-token cap', async () => {
  const { res, sent } = await call([reply(200, emptyLength), reply(200, ok('Hello!'))]);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, [{ generated_text: 'Hello!' }]);
  assert.deepEqual(sent.map((b) => b.max_tokens), [16, 400]);
});

test('empty reply after the retry gives a clean 502 with no upstream details', async () => {
  const { res, sent } = await call([reply(200, emptyLength), reply(200, emptyLength)]);
  assert.equal(sent.length, 2);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, 'empty_output');
  assert.doesNotMatch(JSON.stringify(res.body), LEAK);
  assert.ok(logs.some((l) => /last upstream body: .*chatcmpl-abc/.test(l)), 'raw body is logged server-side');
});

test('no retry when already at the output cap', async () => {
  const { res, sent } = await call([reply(200, emptyLength)], { inputs: 'hi', parameters: { max_new_tokens: 999 } });
  assert.deepEqual(sent.map((b) => b.max_tokens), [400]);
  assert.equal(res.statusCode, 502);
});

test('upstream errors and exceptions return fixed messages', async () => {
  let { res } = await call([reply(500, { error: { message: 'internal', request_id: 'req_01secret' } })]);
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, 'upstream_error');
  assert.doesNotMatch(JSON.stringify(res.body), /req_01|internal/);

  ({ res } = await call([reply(401, { error: { message: 'Invalid API Key' } })]));
  assert.equal(res.statusCode, 502);
  assert.doesNotMatch(JSON.stringify(res.body), /API Key/);

  ({ res } = await call([new Error('getaddrinfo ENOTFOUND api.groq.com')]));
  assert.equal(res.statusCode, 502);
  assert.equal(res.body.code, 'proxy_error');
  assert.doesNotMatch(JSON.stringify(res.body), /ENOTFOUND/);
});

test("Groq's own 429 still returns the busy message with Retry-After", async () => {
  const { res } = await call([reply(429, { error: { message: 'rate limit' } }, { 'retry-after': '7' })]);
  assert.equal(res.statusCode, 429);
  assert.equal(res.body.code, 'upstream_rate_limited');
  assert.equal(res.headers['Retry-After'], '7');
});

test('per-visitor limit: 11th request in a minute gets 429 (single instance)', async (t) => {
  // Fixed windows are epoch-aligned; skip if the burst would straddle a minute boundary.
  if (Date.now() % 60000 > 55000) t.skip('too close to a minute boundary');
  const codes = [];
  for (let i = 0; i < 11; i += 1) {
    const { res } = await call([reply(200, ok('hi'))], { inputs: 'hi' }, '10.9.9.9');
    codes.push(res.statusCode);
  }
  assert.deepEqual(codes, [...Array(10).fill(200), 429]);
});
