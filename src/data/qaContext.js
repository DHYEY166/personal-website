// API Configuration for Chatbot
// Use an instruction-tuned model for factual Q&A over a long bio. DialoGPT is a short-chat model
// and largely ignores long pasted context — responses look "hardcoded" or random without good fallbacks.
export const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

/** Default: routed on most HF Inference Provider accounts; override or set `provider:model` suffix per HF docs */
export const HUGGINGFACE_MODEL_ID =
  import.meta.env.VITE_HUGGINGFACE_MODEL_ID || 'Qwen/Qwen2.5-1.5B-Instruct';

/** Legacy URL (deprecated). Browser calls use `/api/hf-chat`, which uses router.huggingface.co. */
export const HUGGINGFACE_API_URL = `https://router.huggingface.co/v1/chat/completions`;

/**
 * `phi3` — Phi-3 / similar Microsoft chat templates (<|system|>…<|end|>).
 * `plain` — single user block (works for many instruct models on HF; try if phi3 looks wrong).
 */
export const HUGGINGFACE_PROMPT_STYLE = import.meta.env.VITE_HUGGINGFACE_PROMPT_STYLE || 'phi3';

const PORTFOLIO_SYSTEM = `You are Dhyey Desai's portfolio assistant. Answer visitors using ONLY the FACTS below. Rules:
- Be concise, friendly, and accurate (short paragraphs or bullets).
- If the FACTS do not contain the answer, say you do not have that information — do not invent employers, dates, or projects.
- Do not claim to browse the web or access files outside the FACTS.

FACTS:
`;

function buildPhi3ChatInput(userMessage) {
  const systemBlock = `${PORTFOLIO_SYSTEM}${QA_CONTEXT}`;
  return `<|system|>\n${systemBlock}\n<|end|>\n<|user|>\n${userMessage.trim()}\n<|end|>\n<|assistant|>\n`;
}

function buildPlainInstructInput(userMessage) {
  return `${PORTFOLIO_SYSTEM}${QA_CONTEXT}\n\nQuestion: ${userMessage.trim()}\n\nAnswer:`;
}

/** Full prompt string sent to Hugging Face text-generation inference */
export function buildHuggingFaceInputs(userMessage) {
  const style = String(HUGGINGFACE_PROMPT_STYLE).toLowerCase();
  if (style === 'plain' || style === 'dialo') {
    return buildPlainInstructInput(userMessage);
  }
  return buildPhi3ChatInput(userMessage);
}

export const QA_CONTEXT = `Dhyey Desai is an AI/ML Engineer based in Los Angeles, California. Email: dhyeydes@usc.edu. Education: M.S. in Applied Data Science (USC, GPA: 3.73, 2024–2026), B.Tech in Computer Science and Engineering (Manipal University Jaipur, GPA: 3.85, 2020–2024).

Technical Skills: Programming Languages (Python, SQL, Java, C, Scala), ML & GenAI (Recommender Systems, Transformers, CNN/RNN/LSTM, RAG, Generative AI, Foundation Models, Statistical Modeling, Data Mining), Multimodal & NLP (CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL), ML Engineering (Model Deployment, Spark RDD, Hadoop, ETL, Quantization, Optimization), Tools & APIs (TensorFlow, OpenAI/Gemini API, SQL, MongoDB, Databricks, Git, Tableau, Microsoft Excel, PowerPoint), Cloud (AWS - Certified Cloud Practitioner).

Professional Experience: Starcycle (Data Science Co-op, 02/26 – 05/26) - Prototyping Python tools and ETL pipelines parsing 1K+ inputs, generating synthetic and knowledge-graph-backed datasets, designing and evaluating 50+ prompts and API/MCP integrations. nala (AI/ML Engineer Intern, 05/25 – 08/25) - Built RAG system with OpenAI Function Calling + Firebase handling 500+ voice notes for pet health analytics across 3 cross-team dashboards, developed multimodal AI pipeline processing 200+ audio files reducing manual review time by 60%, created visualization engine in Scala with 12+ chart types and Redis caching cutting render time by 45%. Genpact (Generative AI Engineer Intern, 04/24 – 06/24) - Built AI-powered PO Automation conversational AI for multi-document querying, designed and optimized prompt sets with GPT-4 and custom evaluation metrics, contributed to scalable deployment workflows.

Key Projects: MultiLLM (Sep 2025 - Dec 2025) - Privacy-first AI platform with real-time streaming chat, intelligent task classification across 5+ local Ollama models, multi-format knowledge base supporting 10+ file types, Google OAuth authentication, Redis session management, rate limiting, and GDPR/HIPAA compliance. Yelp Recommendation System (Jan 2025 - May 2025) - Spark RDD + XGBoost recommender with 40+ features, ranked top 3/120, RMSE of 0.9745 (val) and 0.9734 (test). ChatDB (Aug 2024 - Jan 2025) - LLM-powered natural language to SQL converter supporting SQLite, MySQL, PostgreSQL with Matplotlib visualization.

Publications: Brain Stroke Detection using M.L. Models (IEEE Xplore) - Analyzed 8 ML and DL models, improved detection accuracy by 15% using ensemble methods.

Achievements: Origin Weekend: IMPACT S26 – First Place (USC startup sprint with Google and TIE Hub – USC Viterbi), Teaching Assistant for DSCI 551 (Graduate) & DSCI 351 (Undergraduate) - Foundations of Data Management at USC, Advanced Deep Learning Research at National University of Singapore - privacy-preserving facial analysis improving accuracy by 10% and reducing TensorFlow inference latency by 40%.

About: AI/ML Engineer with mid-level experience delivering production-ready RAG and multimodal recommender systems. Currently pursuing MS in Applied Data Science at USC while serving as teaching assistant. Built RAG platform for pet-health analytics at nala, AI assistant automating purchase-order analysis at Genpact, and currently a Data Science Co-op at Starcycle. Skilled in foundation and multimodal models, prompt engineering, and scalable deployment on AWS and Spark. Aims to create secure, high-impact AI solutions that automate workflows and enhance user experience.`;

// Fallback responses for common questions
export const getFallbackResponse = (question) => {
  const q = question.toLowerCase();

  if (q.includes('programming') || q.includes('coding') || q.includes('language') || q.includes('python') || q.includes('java') || q.includes('sql')) {
    return `DHYEY'S PROGRAMMING LANGUAGES

PRIMARY LANGUAGES:
• Python - Advanced proficiency for ML/AI development, data analysis, and backend systems
• SQL - Expert level for database management, queries, and data manipulation
• Java - Proficient for enterprise applications and system development
• C - Systems programming
• Scala - Data engineering and visualization

EXPERIENCE:
Python is his primary language for machine learning, data science, and AI projects. SQL for database management and data analysis. Java for enterprise-level applications. C for systems programming. Scala for data engineering, used to build a visualization engine at nala.`;
  }

  if (q.includes('nala')) {
    return `DHYEY'S WORK AT NALA

POSITION: AI/ML Engineer Intern (May 2025 - August 2025)

KEY ACHIEVEMENTS:
• Built RAG system with OpenAI Function Calling + Firebase handling 500+ voice notes, delivering actionable pet health analytics across 3 cross-team dashboards
• Developed multimodal AI pipeline processing 200+ audio files with real-time speech transcription, PDF analysis, and summarization using TensorFlow and Transformers, reducing manual document review time by 60%
• Created visualization engine in Scala supporting 12+ chart types with Redis caching, cutting data representation render time by 45% and enabling real-time analytics for 100+ daily queries

IMPACT: Built production-ready AI systems for pet health analytics, combining RAG, multimodal processing, and scalable visualization.`;
  }

  if (q.includes('genpact')) {
    return `DHYEY'S WORK AT GENPACT

POSITION: Generative AI Engineer Intern (April 2024 - June 2024)

KEY ACHIEVEMENTS:
• Built AI-powered PO Automation conversational AI to analyze large purchase orders and enable multi-document querying
• Designed and optimized prompt sets to test system accuracy, relevance, and robustness in production environments
• Contributed to scalable deployment workflows, improving inference performance and reliability for enterprise use

IMPACT: Focused on enterprise AI automation, specifically in finance sector with emphasis on conversational AI and document processing.`;
  }

  if (q.includes('nus') || q.includes('singapore')) {
    return `DHYEY'S WORK AT NUS

CONTEXT: Advanced Deep Learning Research
LOCATION: National University of Singapore

KEY ACHIEVEMENTS:
• Conducted privacy-preserving facial analysis research, improving model accuracy by 10%
• Reduced TensorFlow inference latency by 40% on 3x larger batches

IMPACT: Research-focused work advancing privacy-preserving AI techniques and optimization of deep learning systems for facial analysis applications.`;
  }

  if (q.includes('certification') || q.includes('certificate') || q.includes('aws') || q.includes('coursera') || q.includes('stanford') || q.includes('learning')) {
    return `DHYEY'S PROFESSIONAL CERTIFICATIONS

RECENT (2024):
• Introducing Generative AI with AWS (Udacity, Sept 2024)
• Data Visualization with Python (IBM/Coursera, March 2024)

AI & MACHINE LEARNING (2023):
• AWS Academy Graduate – ML for Natural Language Processing (Digital Badge)
• AWS Academy Graduate – ML Foundations (Digital Badge)
• Introduction to Generative AI (Google Cloud/Coursera)
• Data Collection and Processing with Python (University of Michigan)
• Python Classes and Inheritance (University of Michigan)

CORE ML FOUNDATIONS (2022):
• Machine Learning (Stanford University/Coursera) - Classic Andrew Ng course
• Supervised Machine Learning: Regression and Classification (DeepLearning.AI & Stanford)
• Dynamic Programming, Greedy Algorithms (University of Colorado Boulder)
• CCNAv7: Introduction to Networks & Switching/Routing (Cisco Networking Academy)
• Database Foundations (Oracle Academy)
• Introduction to Basic Game Development using Scratch (Coursera)

PROGRAMMING FOUNDATIONS (2021):
• Introduction to Object-Oriented Programming with Java (LearnQuest/Coursera)
• Python Basics (University of Michigan/Coursera)

BUSINESS & FINANCE (2023):
• Organizational Behavior: How to Manage People (IESE Business School)
• FinTech and the Transformation in Financial Services (Copenhagen Business School)

TOTAL: 18+ verified professional certifications from top institutions including Stanford, AWS Academy, Google Cloud, IBM, University of Michigan, and leading business schools. All major certifications include verification links and many feature digital badges.`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('technical')) {
    return `DHYEY'S TECHNICAL SKILLS

PROGRAMMING LANGUAGES:
Python, SQL, Java, C, Scala

ML & GENERATIVE AI:
Recommender Systems, Transformers, CNN/RNN/LSTM, RAG (Retrieval Augmented Generation), Foundation Models, Generative AI, Statistical Modeling, Data Mining

MULTIMODAL & NLP:
CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL

ML ENGINEERING:
Model Deployment, Spark RDD, Hadoop, ETL, Quantization, Optimization

TOOLS & APIs:
TensorFlow, OpenAI/Gemini API, SQL, MongoDB, Databricks, Git, Tableau, Microsoft Excel, PowerPoint

CLOUD:
AWS (Certified Cloud Practitioner)`;
  }

  if (q.includes('project') || q.includes('yelp') || q.includes('chatdb') || q.includes('hate speech')) {
    return `DHYEY'S KEY PROJECTS

MULTILLM - Intelligent Multi-Model AI System (Deployed)
Sep 2025 - Dec 2025: Privacy-first AI platform with real-time streaming chat, intelligent task classification across 5+ local Ollama models (Llama 3.2, DeepSeek Coder, Phi3), multi-format knowledge base supporting 10+ file types with semantic chunking, Google OAuth + email/password auth, Redis session management, rate limiting, and GDPR/HIPAA compliance features

YELP RECOMMENDATION SYSTEM (Top 3/120)
Jan 2025 - May 2025: Spark RDD + XGBoost recommender with 40+ features, cold start features using check-in counts, photo frequency, tip sentiment, and business category embeddings, RMSE of 0.9745 (val) and 0.9734 (test)

CHATDB - Database Management & Visualization Tool
Aug 2024 - Jan 2025: LLM-powered natural language to SQL converter, supports SQLite, MySQL, PostgreSQL, data visualization with Matplotlib bar, line, and scatter plots

BRAIN STROKE DETECTION (IEEE Published)
Analyzed 8 ML/DL models with advanced preprocessing, improved detection accuracy by 15% using ensemble methods`;
  }

  if (q.includes('education') || q.includes('degree') || q.includes('study') || q.includes('university')) {
    return `DHYEY'S EDUCATION

CURRENT:
Master of Science in Applied Data Science, University of Southern California (USC), GPA: 3.73, August 2024 - May 2026
Coursework: Foundations of Data Management, Machine Learning for Data Science, Foundations and Applications of Data Mining

COMPLETED:
Bachelor of Technology in Computer Science & Engineering, Manipal University Jaipur, Rajasthan, GPA: 3.85, July 2020 - May 2024
Coursework: Data Science And Machine Learning, Image Processing And Pattern Analysis, Artificial Intelligence, Regression Analysis And Forecasting

ACADEMIC ACHIEVEMENTS:
Teaching Assistant for Graduate & Undergraduate courses at USC`;
  }

  if (q.includes('skill') || q.includes('technology') || q.includes('programming')) {
    return `DHYEY'S TECHNICAL SKILLS

ML & GENERATIVE AI:
Recommender Systems, Transformers, CNN/RNN/LSTM, RAG (Retrieval Augmented Generation), Foundation Models, Generative AI, Statistical Modeling, Data Mining

MULTIMODAL & NLP:
CV, NLP, NER, Sentiment Analysis, Text-to-SQL, Multimodal Pretraining

ML ENGINEERING:
Model Deployment, Quantization, Optimization, Spark RDD, Hadoop, ETL Pipelines

TOOLS & PLATFORMS:
TensorFlow, OpenAI/Gemini API, SQL, MongoDB, Databricks, Git, Tableau

CLOUD:
AWS (Certified Cloud Practitioner)`;
  }

  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('intern')) {
    return `DHYEY'S PROFESSIONAL EXPERIENCE

STARCYCLE (Data Science Co-op)
Feb 2026 - May 2026: Prototyping Python tools and ETL pipelines parsing 1K+ inputs, generating synthetic and knowledge-graph-backed datasets with 5+ dashboards, designing and evaluating 50+ prompts, context strategies, and API/MCP integrations

NALA (AI/ML Engineer Intern)
May 2025 - Aug 2025: Built RAG system with OpenAI Function Calling + Firebase handling 500+ voice notes, developed multimodal AI pipeline reducing manual review time by 60%, created Scala visualization engine with Redis caching cutting render time by 45%

GENPACT (Generative AI Engineer Intern)
Apr 2024 - Jun 2024: Built AI-powered PO Automation conversational AI, designed prompt sets with GPT-4 and custom evaluation metrics, contributed to scalable enterprise deployment workflows`;
  }

  if (q.includes('summary') || q.includes('resume') || q.includes('overview') || (q.includes('tell me about') && !q.includes('project') && !q.includes('education') && !q.includes('skill') && !q.includes('experience'))) {
    return `DHYEY DESAI - RESUME SUMMARY

EDUCATION:
MS in Applied Data Science (USC, GPA: 3.73, 2024-2026), BTech Computer Science (Manipal University, GPA: 3.85, 2020-2024)

EXPERIENCE:
Data Science Co-op at Starcycle (2026), AI/ML Engineer Intern at nala (2025), GenAI Intern at Genpact (2024)

TECHNICAL SKILLS:
ML & GenAI (Transformers, RAG, Foundation Models, Statistical Modeling), Languages (Python, SQL, Java, C, Scala), Cloud (AWS Certified Cloud Practitioner)

KEY PROJECTS:
MultiLLM (Privacy-first Multi-Model AI Platform), Yelp Recommendation System (Top 3/120), ChatDB - Natural Language to SQL Tool

PUBLICATIONS:
Brain Stroke Detection (IEEE Xplore)

ACHIEVEMENTS:
Origin Weekend: IMPACT S26 - First Place, USC Teaching Assistant, NUS Deep Learning Research`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return `CONTACT DHYEY DESAI

EMAIL: dhyeydes@usc.edu
LOCATION: Los Angeles, California

SOCIAL PROFILES:
LinkedIn: linkedin.com/in/dhyey-desai-80659a216, GitHub: github.com/DHYEY166

PROFESSIONAL STATUS:
Currently pursuing MS at USC, Open to AI/ML opportunities, Available for collaborations`;
  }

  if (q.includes('about') || q.includes('who') || q.includes('background')) {
    return `ABOUT DHYEY DESAI

OVERVIEW:
AI/ML Engineer based in Los Angeles, Currently pursuing MS in Applied Data Science at USC (GPA: 3.73), Mid-level experience delivering production-ready RAG and multimodal recommender systems

PROFESSIONAL BACKGROUND:
Data Science Co-op at Starcycle, AI/ML Engineer Intern at nala, Generative AI Engineer Intern at Genpact

EXPERTISE:
Foundation and Multimodal Models, RAG Systems, Prompt Engineering, Scalable Deployment on AWS and Spark, Recommender Systems

RECOGNITION:
Origin Weekend: IMPACT S26 - First Place (USC/Google/TIE Hub), USC Teaching Assistant, IEEE Published Researcher, AWS Certified Cloud Practitioner`;
  }

  if (q.includes('achievement') || q.includes('award') || q.includes('recognition')) {
    return `DHYEY'S ACHIEVEMENTS & RECOGNITION

COMPETITION SUCCESS:
Origin Weekend: IMPACT S26 - First Place, Won USC startup launch sprint organised with Google and TIE Hub - USC Viterbi

ACADEMIC EXCELLENCE:
Teaching Assistant for DSCI 551 (Graduate Level), Teaching Assistant for DSCI 351 (Undergraduate Level), Foundations of Data Management at USC

RESEARCH:
Advanced Deep Learning Research at National University of Singapore, Privacy-preserving facial analysis improving model accuracy by 10%, Reduced TensorFlow inference latency by 40% on 3x larger batches

PUBLICATIONS:
Brain Stroke Detection using M.L. Models (IEEE Xplore), Improved detection accuracy by 15% using ensemble methods`;
  }

  return "I can help you learn about Dhyey's background! Try asking: 'What programming languages does he know?', 'Give me a summary of his resume', 'What are his technical skills?', 'Tell me about his projects', or 'What's his experience?'";
};
