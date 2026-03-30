/**
 * Server-side Hugging Face proxy — avoids browser CORS.
 * Uses Inference Providers router (legacy api-inference.huggingface.co returns 410).
 * Set HUGGINGFACE_API_KEY in Vercel (fine-grained token: "Make calls to Inference Providers").
 */
const ROUTER_CHAT_URL = 'https://router.huggingface.co/v1/chat/completions';

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

  const modelId =
    process.env.HUGGINGFACE_MODEL_ID ||
    process.env.VITE_HUGGINGFACE_MODEL_ID ||
    'microsoft/Phi-3-mini-4k-instruct';

  if (!/^[^/]+\/[^/]+$/.test(modelId) || modelId.length > 120) {
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

  const payload = {
    model: modelId,
    messages: buildChatMessages(inputs),
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
  };

  try {
    const hfRes = await fetch(ROUTER_CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const raw = await hfRes.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : null;
    } catch {
      res.status(hfRes.ok ? 500 : hfRes.status).send(raw);
      return;
    }

    if (!hfRes.ok) {
      const msg =
        typeof parsed?.error === 'string'
          ? parsed.error
          : parsed?.error?.message || parsed?.message;
      res.status(hfRes.status).json(
        msg ? { error: msg, ...parsed } : parsed || { error: raw.slice(0, 500) },
      );
      return;
    }

    const content = parsed?.choices?.[0]?.message?.content;
    const textOut = typeof content === 'string' ? content.trim() : '';

    if (textOut) {
      res.status(200).json([{ generated_text: textOut }]);
      return;
    }

    res.status(200).json(parsed);
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'Proxy request failed',
    });
  }
}
