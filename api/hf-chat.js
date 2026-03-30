/**
 * Server-side chat proxy — avoids browser CORS.
 * - Optional GROQ_API_KEY: OpenAI-compatible API (https://console.groq.com/keys); tried first when set.
 * - HUGGINGFACE_API_KEY: Inference Providers router (fine-grained token: "Make calls to Inference Providers").
 * Set at least one of the above in Vercel.
 */
const ROUTER_BASE = 'https://router.huggingface.co/v1';
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

async function tryGroqChat(groqKey, inputs, maxTokens, temperature, topP) {
  const model =
    (process.env.GROQ_MODEL_ID || 'llama-3.1-8b-instant').trim() ||
    'llama-3.1-8b-instant';
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
    }),
  });
  const raw = await gr.text();
  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  const textOut =
    gr.ok && !parsed?.error ? extractChatText(parsed) : '';
  return {
    textOut,
    lastParsed: parsed,
    lastRaw: raw,
    lastStatus: gr.ok && !parsed?.error ? gr.status : parsed?.error ? 400 : gr.status,
  };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const hfToken =
    process.env.HUGGINGFACE_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY?.trim();

  if (!hfToken && !groqKey) {
    res.status(500).json({
      error:
        'Missing GROQ_API_KEY or HUGGINGFACE_API_KEY on server. Add GROQ_API_KEY from https://console.groq.com/keys (easiest), or fix HF Inference Providers and use HUGGINGFACE_API_KEY.',
    });
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

  const explicitModel = (
    process.env.HUGGINGFACE_MODEL_ID ||
    process.env.VITE_HUGGINGFACE_MODEL_ID ||
    ''
  ).trim();

  if (explicitModel && !isValidModelId(explicitModel)) {
    res.status(500).json({ error: 'Invalid HUGGINGFACE_MODEL_ID' });
    return;
  }

  const modelAttempts = hfToken
    ? buildModelAttemptList(explicitModel || null)
    : [];

  const defaultParams = {
    max_new_tokens: 384,
    temperature: 0.35,
    top_p: 0.9,
    do_sample: true,
    return_full_text: false,
  };
  const p = { ...defaultParams, ...parameters };

  const maxTokens = Math.min(
    4096,
    Math.max(1, Number(p.max_new_tokens) || 384),
  );
  const temperature =
    typeof p.temperature === 'number' ? p.temperature : 0.35;
  const topP = typeof p.top_p === 'number' ? p.top_p : 0.9;

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

    if (!textOut) {
      const base =
        flattenHfError(lastParsed) ||
        (typeof lastParsed?.error?.message === 'string'
          ? lastParsed.error.message
          : '') ||
        lastRaw.slice(0, 800) ||
        'Empty model output';
      const errMsg = /not supported by any provider/i.test(base)
        ? `${base} ${PROVIDER_SETUP_HINT}`
        : base;
      const outStatus =
        lastStatus >= 400 ? lastStatus : hfPayloadIsError(lastParsed) ? 400 : 502;
      res.status(outStatus).json({ error: errMsg });
      return;
    }

    res.status(200).json([{ generated_text: textOut }]);
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'Proxy request failed',
    });
  }
}
