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

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

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

Powered by Hugging Face's DialoGPT model with custom context about Dhyey's professional background.

## License

This project is open source and available under the [MIT License](LICENSE).

## About Dhyey Desai

AI/ML Engineer and Data Scientist based in Los Angeles, California. Currently pursuing MS in Applied Data Science at USC with experience at companies like nala, Genpact, and NUS.

**Contact:** dhyeydes@usc.edu  
**LinkedIn:** [linkedin.com/in/dhyey-desai-80659a216](https://www.linkedin.com/in/dhyey-desai-80659a216)  
**GitHub:** [github.com/DHYEY166](https://github.com/DHYEY166)
