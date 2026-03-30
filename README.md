# Dhyey Desai - Personal Portfolio Website

A modern, interactive personal portfolio website showcasing Dhyey Desai's skills, experience, and projects in AI/ML Engineering and Data Science.

## Features

### Interactive Sections
- **About Me** - Personal background and information
- **Skills** - Technical expertise and technologies
- **Projects** - Featured AI/ML projects with achievements
- **Certifications** - Professional certifications and achievements
- **Resume** - Complete professional background
- **Contact** - Professional contact information
- **AI Chatbot** - Interactive Q&A about Dhyey's background (powered by Hugging Face)

### Technical Features
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Beautiful gradients and animations
- **React Router** - Smooth navigation between sections
- **Environment Variables** - Secure API key management
- **Vite Build** - Fast development and optimized production builds

## Tech Stack

- **Frontend:** React 18, Vite
- **Styling:** Inline CSS with modern gradients and animations
- **Routing:** React Router DOM
- **AI Integration:** Hugging Face Inference API
- **Deployment:** Vercel
- **Version Control:** Git/GitHub

## Live Website

**Visit:** [https://personal-website-dun-eta-72.vercel.app/](https://personal-website-dun-eta-72.vercel.app/)

## Installation & Development

```bash
# Clone the repository
git clone https://github.com/DHYEY166/personal-website.git
cd personal-website

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your VITE_HUGGINGFACE_API_KEY to .env

# Start development server
npm run dev

# To test the AI chat locally (needs `/api/hf-chat` serverless route):
# npx vercel dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_HUGGINGFACE_API_KEY=your_huggingface_token_here

# Optional — defaults to Qwen/Qwen2.5-1.5B-Instruct (works with Inference Providers without extra setup).
# Use another id if you enable providers at https://huggingface.co/settings/inference-providers
# (e.g. microsoft/Phi-3-mini-4k-instruct once a host is enabled, or model:id:fastest per HF docs).
# VITE_HUGGINGFACE_MODEL_ID=microsoft/Phi-3-mini-4k-instruct

# Optional prompt format: phi3 (default) or plain for some instruct models
# VITE_HUGGINGFACE_PROMPT_STYLE=plain

# Recommended on Vercel (serverless proxy — avoids browser CORS on HF API):
# HUGGINGFACE_API_KEY=same_token_as_above
# HUGGINGFACE_MODEL_ID=Qwen/Qwen2.5-1.5B-Instruct
# The chat UI calls /api/hf-chat; the server uses this key. VITE_HUGGINGFACE_API_KEY alone
# still works if exposed to Serverless Functions (set in Vercel dashboard).

# Contact form (Web3Forms)
# VITE_WEB3FORMS_KEY=your_web3forms_access_key
```

The chatbot sends a **system + bio** block on each request so the model answers from your facts. **`getFallbackResponse`** in `src/data/qaContext.js` is only used when the API fails, the key is missing, or the response is empty — it is keyword-based, not the main “AI path.”

**If the API returns “not supported by any provider you have enabled”:** open [Inference Providers settings](https://huggingface.co/settings/inference-providers), turn on at least one provider, and use a token with **Make calls to Inference Providers**. No provider enabled means **no model id will work** on the router.

## Project Structure

```
personal-website/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── public/
│   ├── profile.jpg      # Profile image
│   └── Dhyey_Desai_Resume.pdf  # Resume file
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── .env                 # Environment variables (not in repo)
```

## Deployment

This project is deployed on **Vercel** with automatic deployments from GitHub:

1. **GitHub Repository:** [https://github.com/DHYEY166/personal-website](https://github.com/DHYEY166/personal-website)
2. **Live Website:** [https://personal-website-dun-eta-72.vercel.app/](https://personal-website-dun-eta-72.vercel.app/)

### Alternative Deployment Options

- **Netlify:** Connect GitHub repo and deploy
- **GitHub Pages:** Use GitHub Actions for deployment
- **Firebase Hosting:** Google's hosting platform

## AI Chatbot

The website features an intelligent chatbot that can answer questions about:
- Dhyey's background and experience
- Technical skills and expertise
- Projects and achievements
- Professional certifications
- Education and publications
- Contact information

Powered by Hugging Face Inference Providers (router API) with custom context about Dhyey's professional background.

## License

This project is open source and available under the [MIT License](LICENSE).

## About Dhyey Desai

AI/ML Engineer and Data Scientist based in Los Angeles, California. Currently pursuing MS in Applied Data Science at USC with experience at companies like nala, Genpact, and NUS.

**Contact:** dhyeydes@usc.edu  
**LinkedIn:** [linkedin.com/in/dhyey-desai-80659a216](https://www.linkedin.com/in/dhyey-desai-80659a216)  
**GitHub:** [github.com/DHYEY166](https://github.com/DHYEY166)
