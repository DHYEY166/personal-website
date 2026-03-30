/**
 * Server-side Hugging Face proxy — avoids browser CORS.
 * Uses Inference Providers router (legacy api-inference.huggingface.co returns 410).
 * Set HUGGINGFACE_API_KEY in Vercel (fine-grained token: "Make calls to Inference Providers").
 */
const ROUTER_BASE = 'https://router.huggingface.co/v1';

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

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token =
    process.env.HUGGINGFACE_API_KEY || process.env.VITE_HUGGINGFACE_API_KEY;

  if (!token) {
    res.status(500).json({ error: 'Missing HUGGINGFACE_API_KEY on server' });
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

  // Default: small instruct model widely routed on Inference Providers (Phi-3 often needs a provider enabled in HF settings).
  const modelId =
    process.env.HUGGINGFACE_MODEL_ID ||
    process.env.VITE_HUGGINGFACE_MODEL_ID ||
    'Qwen/Qwen2.5-1.5B-Instruct';

  if (!/^[^/]+\/[^/]+$/.test(modelId) || modelId.length > 160) {
    res.status(500).json({ error: 'Invalid HUGGINGFACE_MODEL_ID' });
    return;
  }

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

    // 1) Chat completions first — clean system/user from Phi-3 tags (better for Qwen, Mistral, etc.)
    const chat = await routerPost('chat/completions', token, {
      model: modelId,
      messages: buildChatMessages(inputs),
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
    });
    lastParsed = chat.parsed;
    lastRaw = chat.raw;
    lastStatus = chat.hfRes.status;
    if (chat.hfRes.ok) {
      textOut = extractChatText(chat.parsed);
    }

    // 2) Responses API — legacy-style full prompt string (fallback)
    if (!textOut) {
      let r = await routerPost('responses', token, {
        model: modelId,
        input: inputs,
        ...sampling,
      });
      if (
        (!r.hfRes.ok || !extractResponsesText(r.parsed)) &&
        r.hfRes.status === 400
      ) {
        r = await routerPost('responses', token, {
          model: modelId,
          input: inputs,
        });
      }
      lastParsed = r.parsed;
      lastRaw = r.raw;
      lastStatus = r.hfRes.status;
      if (r.hfRes.ok) {
        textOut = extractResponsesText(r.parsed);
      }
    }

    if (!textOut) {
      const errMsg =
        flattenHfError(lastParsed) || lastRaw.slice(0, 800) || 'Empty model output';
      res.status(lastStatus >= 400 ? lastStatus : 502).json({ error: errMsg });
      return;
    }

    res.status(200).json([{ generated_text: textOut }]);
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'Proxy request failed',
    });
  }
}
