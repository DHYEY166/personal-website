/**
 * Server-side Hugging Face proxy — avoids browser CORS (HF API is not intended for direct browser calls).
 * Set HUGGINGFACE_API_KEY in Vercel (or reuse VITE_HUGGINGFACE_API_KEY for serverless only).
 */
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

  const url = `https://api-inference.huggingface.co/models/${modelId}`;

  const defaultParams = {
    max_new_tokens: 384,
    temperature: 0.35,
    top_p: 0.9,
    do_sample: true,
    return_full_text: false,
  };

  try {
    const hfRes = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs,
        parameters: { ...defaultParams, ...parameters },
      }),
    });

    const raw = await hfRes.text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      res.status(hfRes.ok ? 500 : hfRes.status).send(raw);
      return;
    }

    res.status(hfRes.status).json(parsed);
  } catch (e) {
    res.status(502).json({
      error: e instanceof Error ? e.message : 'Proxy request failed',
    });
  }
}
