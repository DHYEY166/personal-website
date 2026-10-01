/**
 * Server-side chat proxy — avoids browser CORS.
 * - Optional GROQ_API_KEY: OpenAI-compatible API (https://console.groq.com/keys); tried first when set.
 * - HUGGINGFACE_API_KEY: Inference Providers router (fine-grained token: "Make calls to Inference Providers").
 * Set at least one of the above in Vercel.
 */
const ROUTER_BASE = 'https://router.huggingface.co/v1';

/** Hard limits so the route cannot be used as a cheap general-purpose LLM proxy. */
const MAX_OUTPUT_TOKENS = 400; // includes gpt-oss reasoning tokens; the client asks for 300
const DEFAULT_OUTPUT_TOKENS = 300;
const MAX_INPUT_CHARS = 8000; // system prompt + compact portfolio facts (~5k today) + question
const MAX_QUESTION_CHARS = 1000;

const PRODUCTION_ORIGIN = 'https://personal-website-dun-eta-72.vercel.app';
const LOCAL_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
/** Vercel preview deployments of this project (per-commit and per-branch URLs). */
const PREVIEW_ORIGIN_RE = /^https:\/\/personal-website-[a-z0-9-]+-dhyeys-projects-8579ba17\.vercel\.app$/;

/* ---------------- Per-visitor rate limiting ----------------
 * Best effort. Without a shared store each serverless instance keeps its own counters, so a
 * visitor whose requests land on different instances can exceed the limits, and counters reset
 * on cold starts. If UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN (or Vercel KV's
 * KV_REST_API_URL/KV_REST_API_TOKEN) are set, counters are shared through Upstash's REST API
 * instead; on any Upstash error the in-memory limiter is used.
 */
const RATE_LIMITS = [
  { name: 'minute', windowMs: 60 * 1000, max: 10 },
  { name: 'day', windowMs: 24 * 60 * 60 * 1000, max: 40 },
];
const memoryCounters = new Map(); // `${name}:${ip}:${window}` -> count
const MAX_MEMORY_KEYS = 10000;

function clientIp(req) {
  const xff = req.headers?.['x-forwarded-for'];
  const first = (Array.isArray(xff) ? xff[0] : xff || '').split(',')[0].trim();
  return first || req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

/** Fixed windows aligned to the epoch: returns the keys and seconds until each window resets. */
function windowsFor(ip, now) {
  return RATE_LIMITS.map((l) => {
    const index = Math.floor(now / l.windowMs);
    return {
      ...l,
      key: `rl:hf-chat:${l.name}:${ip}:${index}`,
      resetInSec: Math.max(1, Math.ceil(((index + 1) * l.windowMs - now) / 1000)),
    };
  });
}

function memoryHit(windows) {
  if (memoryCounters.size > MAX_MEMORY_KEYS) memoryCounters.clear();
  return windows.map((w) => {
    const count = (memoryCounters.get(w.key) || 0) + 1;
    memoryCounters.set(w.key, count);
    return count;
  });
}

async function upstashHit(windows) {
  const url = (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '').replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  const commands = windows.flatMap((w) => [
    ['INCR', w.key],
    ['PEXPIRE', w.key, String(w.windowMs)],
  ]);
  const r = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`Upstash HTTP ${r.status}`);
  const out = await r.json();
  return windows.map((_, i) => Number(out?.[i * 2]?.result));
}

/** Counts this request and returns { limited, retryAfterSec, limitName }. */
async function checkRateLimit(ip) {
  const windows = windowsFor(ip, Date.now());
  let counts = null;
  try {
    counts = await upstashHit(windows);
  } catch (e) {
    console.warn('[hf-chat] Upstash rate limit failed, using in-memory limiter:', e instanceof Error ? e.message : e);
  }
  if (!counts || counts.some((c) => !Number.isFinite(c))) counts = memoryHit(windows);
  const over = windows.filter((w, i) => counts[i] > w.max);
  if (!over.length) return { limited: false };
  const worst = over.reduce((a, b) => (b.resetInSec > a.resetInSec ? b : a));
  return { limited: true, retryAfterSec: worst.resetInSec, limitName: worst.name };
}

/**
 * Allowed browser origins: production, this deployment's own Vercel URLs (previews),
 * localhost, plus any extra comma-separated origins in ALLOWED_ORIGINS.
 */
function allowedOrigins() {
  const set = new Set([PRODUCTION_ORIGIN]);
  for (const v of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (v) set.add(`https://${v}`);
  }
  for (const v of (process.env.ALLOWED_ORIGINS || '').split(',')) {
    if (v.trim()) set.add(v.trim().replace(/\/$/, ''));
  }
  return set;
}

function requestOrigin(req) {
  const origin = req.headers?.origin;
  if (origin) return origin;
  // Some browsers omit Origin on same-origin requests; fall back to Referer.
  const referer = req.headers?.referer;
  if (!referer) return '';
  try {
    return new URL(referer).origin;
  } catch {
    return '';
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return LOCAL_ORIGIN_RE.test(origin) || PREVIEW_ORIGIN_RE.test(origin) || allowedOrigins().has(origin);
}

function clampNumber(value, min, max, fallback) {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, n));
}
const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions';

/** Phi-3 template from qaContext → OpenAI-style messages (avoids double chat templating). */
function buildChatMessages(inputs) {
  const text = String(inputs);
  const sys = text.match(/<\|system\|>\s*\n([\s\S]*?)\s*\n<\|end\|>/);
  const usr = text.match(/<\|user\|>\s*\n([\s\S]*?)\s*\n<\|end\|>/);
  if (sys && usr) {
    return [
      { role: 'system', content: sys[1].trim() },
      { role: 'user', content: usr[1].trim() },
    ];
  }
  return [{ role: 'user', content: text.trim() }];
}

function flattenHfError(parsed) {
  const e = parsed?.error;
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') {
    if (typeof e.message === 'string') return e.message;
    if (typeof e.msg === 'string') return e.msg;
  }
  if (typeof parsed?.message === 'string') return parsed.message;
  try {
    return JSON.stringify(parsed ?? {});
  } catch {
    return 'Request failed';
  }
}

/** Router sometimes returns HTTP 200 with `{ error: ... }` and no `choices` / output. */
function hfPayloadIsError(parsed) {
  return (
    parsed != null &&
    typeof parsed === 'object' &&
    parsed.error != null &&
    parsed.error !== false
  );
}

function effectiveUpstreamStatus(hfRes, parsed) {
  if (!hfRes.ok) return hfRes.status;
  if (hfPayloadIsError(parsed)) return 400;
  return hfRes.status;
}

const PROVIDER_SETUP_HINT =
  'Enable HF Inference and/or a GPU partner at https://huggingface.co/settings/inference-providers (toggle ON). Token: fine-grained with "Make calls to Inference Providers". Or set GROQ_API_KEY (free) from https://console.groq.com/keys to bypass HF routing.';

/** When auto-routing finds no host, try these in order (suffix pins a provider per HF docs). */
const MODEL_FALLBACK_CHAIN = [
  'Qwen/Qwen2.5-1.5B-Instruct:hf-inference',
  'Qwen/Qwen2.5-1.5B-Instruct:preferred',
  'google/gemma-2-2b-it:hf-inference',
  'HuggingFaceTB/SmolLM2-1.7B-Instruct:hf-inference',
  'Qwen/Qwen2.5-1.5B-Instruct',
];

function isValidModelId(id) {
  return (
    typeof id === 'string' &&
    /^[^/]+\/[^/]+$/.test(id) &&
    id.length <= 160
  );
}

function buildModelAttemptList(explicitFromEnv) {
  const chain = [];
  if (explicitFromEnv) {
    chain.push(explicitFromEnv);
    if (!explicitFromEnv.includes(':')) {
      chain.push(
        `${explicitFromEnv}:hf-inference`,
        `${explicitFromEnv}:preferred`,
      );
    }
  }
  chain.push(...MODEL_FALLBACK_CHAIN);
  const seen = new Set();
  return chain.filter((id) => {
    if (!isValidModelId(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function extractChatText(parsed) {
  const content = parsed?.choices?.[0]?.message?.content;
  return typeof content === 'string' ? content.trim() : '';
}

function extractResponsesText(parsed) {
  if (typeof parsed?.output_text === 'string') {
    return parsed.output_text.trim();
  }
  const out = parsed?.output;
  if (!Array.isArray(out)) return '';
  for (const item of out) {
    if (item?.type === 'message' && Array.isArray(item.content)) {
      for (const part of item.content) {
        const t = part?.text;
        if (typeof t === 'string') {
          return t.trim();
        }
      }
    }
  }
  return '';
}

async function inferWithModel(
  token,
  modelId,
  inputs,
  sampling,
  maxTokens,
  temperature,
  topP,
) {
  let lastParsed = null;
  let lastRaw = '';
  let lastStatus = 500;

  const chat = await routerPost('chat/completions', token, {
    model: modelId,
    messages: buildChatMessages(inputs),
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
  });
  lastParsed = chat.parsed;
  lastRaw = chat.raw;
  lastStatus = effectiveUpstreamStatus(chat.hfRes, chat.parsed);
  if (chat.hfRes.ok && !hfPayloadIsError(chat.parsed)) {
    const t = extractChatText(chat.parsed);
    if (t) return { textOut: t, lastParsed, lastRaw, lastStatus };
  }

  let r = await routerPost('responses', token, {
    model: modelId,
    input: inputs,
    ...sampling,
  });
  if (
    (!r.hfRes.ok ||
      hfPayloadIsError(r.parsed) ||
      !extractResponsesText(r.parsed)) &&
    r.hfRes.status === 400
  ) {
    r = await routerPost('responses', token, {
      model: modelId,
      input: inputs,
    });
  }
  lastParsed = r.parsed;
  lastRaw = r.raw;
  lastStatus = effectiveUpstreamStatus(r.hfRes, r.parsed);
  if (r.hfRes.ok && !hfPayloadIsError(r.parsed)) {
    const t = extractResponsesText(r.parsed);
    if (t) return { textOut: t, lastParsed, lastRaw, lastStatus };
  }

  return { textOut: '', lastParsed, lastRaw, lastStatus };
}

async function routerPost(path, token, body) {
  const hfRes = await fetch(`${ROUTER_BASE}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const raw = await hfRes.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  return { hfRes, raw, parsed };
}

async function groqRequest(groqKey, model, inputs, maxTokens, temperature, topP) {
  // GPT-OSS models reason before answering; keep it light so the answer fits in max_tokens.
  const reasoningParams = /gpt-oss/i.test(model)
    ? { reasoning_effort: 'low', include_reasoning: false }
    : {};
  const gr = await fetch(GROQ_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: buildChatMessages(inputs),
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      ...reasoningParams,
    }),
  });
  const raw = await gr.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  const textOut = gr.ok && !parsed?.error ? extractChatText(parsed) : '';
  return { gr, raw, parsed, textOut, finishReason: parsed?.choices?.[0]?.finish_reason ?? null };
}

async function tryGroqChat(groqKey, inputs, maxTokens, temperature, topP) {
  const model =
    (process.env.GROQ_MODEL_ID || 'openai/gpt-oss-20b').trim() ||
    'openai/gpt-oss-20b';
  let r = await groqRequest(groqKey, model, inputs, maxTokens, temperature, topP);
  // Reasoning tokens count toward max_tokens, so a small budget can run out before any answer
  // text is produced. Retry once with the full output cap.
  if (r.gr.ok && !r.textOut && r.finishReason === 'length' && maxTokens < MAX_OUTPUT_TOKENS) {
    console.warn(`[hf-chat] Groq ran out of tokens at max_tokens=${maxTokens}; retrying at ${MAX_OUTPUT_TOKENS}`);
    r = await groqRequest(groqKey, model, inputs, MAX_OUTPUT_TOKENS, temperature, topP);
  }
  if (r.gr.ok && !r.textOut) {
    console.warn(`[hf-chat] Groq returned no content (finish_reason=${r.finishReason ?? 'unknown'})`);
  }
  return {
    textOut: r.textOut,
    retryAfter: r.gr.headers.get('retry-after'),
    lastParsed: r.parsed,
    lastRaw: r.raw,
    // Keep the real HTTP status on failures (e.g. 429) so callers can react to it.
    lastStatus: r.gr.ok ? (r.parsed?.error ? 400 : r.gr.status) : r.gr.status,
  };
}

/** Upstream details (raw bodies, request ids, usage) are logged here and never sent to the client. */
function logUpstreamFailure(base, lastRaw, context) {
  console.error(`[hf-chat] all backends failed (${context}): ${String(base).slice(0, 300)}`);
  if (lastRaw) console.error(`[hf-chat] last upstream body: ${String(lastRaw).slice(0, 1500)}`);
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const origin = requestOrigin(req);
  if (!isAllowedOrigin(origin)) {
    console.warn(`[hf-chat] rejected request from origin "${origin || '(none)'}"`);
    res.status(403).json({ error: 'Origin not allowed' });
    return;
  }

  const ip = clientIp(req);
  const rl = await checkRateLimit(ip);
  if (rl.limited) {
    console.warn(`[hf-chat] rate limited (${rl.limitName}) ip=${ip}`);
    res.setHeader('Retry-After', String(rl.retryAfterSec));
    res.status(429).json({
      error:
        rl.limitName === 'day'
          ? "You've reached today's question limit for this chatbot. Please come back tomorrow."
          : "You've asked a lot of questions in a short time. Please try again in a minute.",
      code: 'rate_limited',
      retryAfter: rl.retryAfterSec,
    });
    return;
  }

  const hfToken =
    process.env.HUGGINGFACE_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY?.trim();

  if (!hfToken && !groqKey) {
    console.error(
      '[hf-chat] no GROQ_API_KEY or HUGGINGFACE_API_KEY configured. Add GROQ_API_KEY from https://console.groq.com/keys (easiest), or fix HF Inference Providers and use HUGGINGFACE_API_KEY.',
    );
    res.status(500).json({ error: 'The chatbot is not configured right now.', code: 'not_configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: 'Invalid JSON body' });
      return;
    }
  }

  const { inputs, parameters } = body || {};
  if (!inputs || typeof inputs !== 'string') {
    res.status(400).json({ error: 'Missing inputs string' });
    return;
  }
  if (inputs.length > MAX_INPUT_CHARS) {
    res.status(413).json({ error: `Input too long (max ${MAX_INPUT_CHARS} characters)` });
    return;
  }
  const question = buildChatMessages(inputs).find((m) => m.role === 'user')?.content || '';
  if (question.length > MAX_QUESTION_CHARS) {
    res.status(413).json({ error: `Question too long (max ${MAX_QUESTION_CHARS} characters)` });
    return;
  }

  const explicitModel = (
    process.env.HUGGINGFACE_MODEL_ID ||
    process.env.VITE_HUGGINGFACE_MODEL_ID ||
    ''
  ).trim();

  if (explicitModel && !isValidModelId(explicitModel)) {
    console.error(`[hf-chat] invalid HUGGINGFACE_MODEL_ID "${explicitModel}"`);
    res.status(500).json({ error: 'The chatbot is not configured right now.', code: 'not_configured' });
    return;
  }

  const modelAttempts = hfToken
    ? buildModelAttemptList(explicitModel || null)
    : [];

  const defaultParams = {
    max_new_tokens: DEFAULT_OUTPUT_TOKENS,
    temperature: 0.35,
    top_p: 0.9,
    do_sample: true,
    return_full_text: false,
  };
  const p = { ...defaultParams, ...(parameters && typeof parameters === 'object' ? parameters : {}) };

  const maxTokens = Math.round(
    clampNumber(Number(p.max_new_tokens), 1, MAX_OUTPUT_TOKENS, defaultParams.max_new_tokens),
  );
  const temperature = clampNumber(p.temperature, 0, 1.5, defaultParams.temperature);
  const topP = clampNumber(p.top_p, 0.05, 1, defaultParams.top_p);

  const sampling = {
    max_output_tokens: maxTokens,
    temperature,
    top_p: topP,
  };

  try {
    let textOut = '';
    let lastParsed = null;
    let lastRaw = '';
    let lastStatus = 500;
    let upstreamRetryAfter = null;

    if (groqKey) {
      const g = await tryGroqChat(
        groqKey,
        inputs,
        maxTokens,
        temperature,
        topP,
      );
      lastParsed = g.lastParsed;
      lastRaw = g.lastRaw;
      lastStatus = g.lastStatus;
      upstreamRetryAfter = g.retryAfter;
      if (g.textOut) {
        textOut = g.textOut;
      }
    }

    if (!textOut && hfToken) {
      for (const modelId of modelAttempts) {
        const out = await inferWithModel(
          hfToken,
          modelId,
          inputs,
          sampling,
          maxTokens,
          temperature,
          topP,
        );
        lastParsed = out.lastParsed;
        lastRaw = out.lastRaw;
        lastStatus = out.lastStatus;
        if (out.textOut) {
          textOut = out.textOut;
          break;
        }
      }
    }

    if (!textOut && lastStatus === 429) {
      // The model provider's own limit (Groq free tier: 30 RPM / 8K TPM / 1K RPD for gpt-oss-20b).
      const retryAfter = Math.min(3600, Math.max(1, Math.ceil(Number(upstreamRetryAfter) || 30)));
      console.warn(`[hf-chat] upstream rate limit hit (retry-after ${upstreamRetryAfter ?? 'n/a'}s)`);
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({
        error: 'The AI service is busy right now. Please try again shortly.',
        code: 'upstream_rate_limited',
        retryAfter,
      });
      return;
    }

    if (!textOut) {
      const base =
        flattenHfError(lastParsed) ||
        (typeof lastParsed?.error?.message === 'string'
          ? lastParsed.error.message
          : '') ||
        lastRaw.slice(0, 800) ||
        'Empty model output';
      const hint = /not supported by any provider/i.test(base) ? ` ${PROVIDER_SETUP_HINT}` : '';
      const upstreamHadError = lastStatus >= 400 || hfPayloadIsError(lastParsed);
      logUpstreamFailure(
        `${base}${hint}`,
        lastRaw,
        `groq: ${groqKey ? 'configured' : 'not set'}, hf models tried: ${modelAttempts.length}, upstream status: ${lastStatus}`,
      );
      // The visitor gets a short, fixed message; the client falls back to its offline answers.
      res.status(502).json(
        upstreamHadError
          ? { error: 'The AI service could not answer right now. Please try again shortly.', code: 'upstream_error' }
          : { error: 'The AI service returned an empty answer. Please try rephrasing your question.', code: 'empty_output' },
      );
      return;
    }

    res.status(200).json([{ generated_text: textOut }]);
  } catch (e) {
    console.error('[hf-chat] proxy request failed:', e instanceof Error ? e.stack || e.message : e);
    res.status(502).json({
      error: 'The AI service could not be reached. Please try again shortly.',
      code: 'proxy_error',
    });
  }
}
