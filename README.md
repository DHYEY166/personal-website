# Dhyey Desai - Personal Portfolio Website

A modern, interactive personal portfolio website showcasing Dhyey Desai's skills, experience, and projects in AI/ML Engineering and Data Science.

## Features

### Sections
- **About** - Background, current role, and education
- **Skills** - Technical skills by category, with a radar overview
- **Projects** - Featured AI/ML projects, filterable, with an accessible details dialog
- **Publications** - Peer-reviewed papers and workshop papers
- **Certifications** - Professional certifications (newest first)
- **Resume** - Experience, education, projects, achievements, and a PDF download
- **Contact** - Contact details and a Web3Forms contact form
- **AI Chatbot** (`/chatbot`) - Q&A about Dhyey's background, answered by an LLM through a serverless route

### Technical Features
- Responsive layout with light/dark themes (persisted in `localStorage`)
- Framer Motion animations that respect `prefers-reduced-motion`
- Lazily loaded 3D hero scene (React Three Fiber) and lazily loaded routes
- Hash links (`/#projects`, etc.) that work from any page, plus a catch-all 404 page
- SEO basics: meta description, canonical URL, Open Graph/Twitter cards, favicon, `robots.txt`, and `sitemap.xml`
- Serverless chat proxy (`api/hf-chat.js`) with an origin allowlist, input-size limits, an output-token cap, and a per-visitor rate limit (10/min, 40/day per IP)
- Chat replies rendered as a safe Markdown subset (no raw HTML)

## Tech Stack

- **Frontend:** React 19, Vite 7, React Router 7
- **Animation / 3D:** Framer Motion, Three.js, React Three Fiber, Drei
- **Styling:** Theme objects with inline styles (`src/styles/theme.js`) plus global CSS (`src/index.css`)
- **AI Integration:** Groq (preferred) or Hugging Face Inference Providers, called via a Vercel serverless function
- **Deployment:** Vercel

## Live Website

**Visit:** [https://personal-website-dun-eta-72.vercel.app/](https://personal-website-dun-eta-72.vercel.app/)

## Installation & Development

Requires Node.js 20.19+ (Vite 7).

```bash
# Clone the repository
git clone https://github.com/DHYEY166/personal-website.git
cd personal-website

# Install dependencies
npm install

# Start the development server (the chatbot falls back to keyword answers without the API)
npm run dev

# To test the AI chat locally with the /api/hf-chat serverless route:
# npx vercel dev

# Lint and build for production
npm run lint
npm run build
npm test          # renderer + mocked chat API tests (no network)
npm run preview
```

## Environment Variables

**Never put secret keys in `VITE_`-prefixed variables.** Vite exposes `VITE_*` values to client code, so they can end up in the public JavaScript bundle. Keep LLM API keys server-only and set them in **Vercel → Project → Settings → Environment Variables** (or in a local `.env` used by `vercel dev`):

```env
# Server-only (read by api/hf-chat.js; never exposed to the browser)
GROQ_API_KEY=gsk_...                    # recommended; get one at https://console.groq.com/keys
# GROQ_MODEL_ID=openai/gpt-oss-20b    # optional
# HUGGINGFACE_API_KEY=hf_...            # optional fallback (fine-grained token with "Make calls to Inference Providers")
# HUGGINGFACE_MODEL_ID=Qwen/Qwen2.5-1.5B-Instruct:hf-inference   # optional
# ALLOWED_ORIGINS=https://my-custom-domain.com   # optional, comma-separated extra origins allowed to call /api/hf-chat
# UPSTASH_REDIS_REST_URL=https://...upstash.io  # optional: share rate-limit counters across instances
# UPSTASH_REDIS_REST_TOKEN=...                  # (Vercel KV's KV_REST_API_URL / KV_REST_API_TOKEN also work)

# Public, safe to expose (client-side)
# VITE_WEB3FORMS_KEY=your_web3forms_access_key   # Web3Forms access keys are designed to be public
# VITE_HUGGINGFACE_PROMPT_STYLE=plain            # optional prompt format: phi3 (default) or plain
```

If both `GROQ_API_KEY` and `HUGGINGFACE_API_KEY` are set, Groq is tried first. The API route still reads the legacy `VITE_HUGGINGFACE_API_KEY` / `VITE_HUGGINGFACE_MODEL_ID` names for backward compatibility; rename them to the non-`VITE_` names.

The chatbot sends a **system + bio** block (built from the files in `src/data/` by `src/data/qaContext.js`) on each request so the model answers from real facts. **`getFallbackResponse`** in `src/data/qaContext.js` is only used when the API fails, the key is missing, or the response is empty. It is keyword-based, not the main AI path.

**Rate limiting:** `/api/hf-chat` allows 10 requests per minute and 40 per day per visitor IP and answers HTTP 429 with a `Retry-After` header beyond that. Without Upstash the counters live in each serverless instance's memory, so they are best effort (separate instances and cold starts each have their own counts). Groq's own free-tier limits (for `openai/gpt-oss-20b`: 30 requests/min, 8K tokens/min, 1K requests/day) are surfaced to visitors as a friendly "busy" message.

**If Hugging Face returns "not supported by any provider you have enabled":** open [Inference Providers settings](https://huggingface.co/settings/inference-providers) and turn on at least **HF Inference** and/or a partner provider, or set `GROQ_API_KEY` instead.

## Project Structure

```
personal-website/
├── api/
│   └── hf-chat.js          # Vercel serverless chat proxy (Groq / Hugging Face)
├── public/
│   ├── Dhyey_Desai_Resume.pdf
│   ├── favicon.svg, og-image.png
│   └── robots.txt, sitemap.xml
├── src/
│   ├── App.jsx             # Routes (/, /chatbot, 404) and providers
│   ├── main.jsx            # React entry point
│   ├── index.css           # Global styles
│   ├── components/         # Layout, UI, and 3D components
│   ├── context/            # Theme context
│   ├── data/               # Site content (resume, projects, publications, skills, chatbot context)
│   ├── hooks/              # Scroll spy, media queries, page meta, etc.
│   ├── pages/              # HomePage, ChatbotPage, NotFoundPage
│   ├── sections/           # Home page sections
│   └── styles/             # Theme tokens
├── index.html              # HTML template, meta tags, and fonts
├── eslint.config.js
├── vite.config.js
└── vercel.json
```

Most content updates only touch `src/data/`. When the resume changes, also replace `public/Dhyey_Desai_Resume.pdf`.

## Deployment

Deployed on **Vercel** with automatic deployments from GitHub ([DHYEY166/personal-website](https://github.com/DHYEY166/personal-website)). Set `GROQ_API_KEY` (and optionally `HUGGINGFACE_API_KEY`) in the Vercel project for the chatbot to work.

## About Dhyey Desai

Associate Forward Deployed Engineer at Momentuum Blue (A Coforge Company) in Princeton, New Jersey, working on agentic AI, RAG, and LLM evaluation. MS in Applied Data Science from USC (2026). Previous experience at Starcycle, Onawa Pet, Genpact, and the National University of Singapore.

**Contact:** dvdesai06@gmail.com  
**LinkedIn:** [linkedin.com/in/dhyey-desai-80659a216](https://www.linkedin.com/in/dhyey-desai-80659a216)  
**GitHub:** [github.com/DHYEY166](https://github.com/DHYEY166)
