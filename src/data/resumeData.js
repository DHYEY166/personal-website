export const RESUME_PDF_PATH = '/Dhyey_Desai_Resume.pdf';

export const education = [
  {
    school: 'University of Southern California',
    period: 'Aug 2024 \u2013 May 2026',
    degree: 'Master of Science, Applied Data Science',
    gpa: 'GPA: 3.76',
    coursework: 'Foundations of Data Management, Machine Learning for Data Science, Foundations and Applications of Data Mining',
  },
  {
    school: 'Manipal University Jaipur, Rajasthan',
    period: 'Jul 2020 \u2013 May 2024',
    degree: 'Bachelor of Technology, Computer Science and Engineering',
    gpa: 'GPA: 3.85',
    coursework: 'Data Science And Machine Learning, Image Processing And Pattern Analysis, Artificial Intelligence, Regression Analysis And Forecasting',
  },
];

export const technicalSkills = [
  { category: 'Programming Languages', items: 'Python, SQL, Java, C, Scala' },
  { category: 'ML & GenAI', items: 'RAG, LangGraph, Function Calling, Hybrid Retrieval (BM25 + embeddings), Reranking, LLM Evaluation (prompt evaluation, citation checks, fixed-set recall tests), Recommender Systems, Transformers, CNN/RNN/LSTM, Generative AI, Foundation Models, Statistical Modeling, Data Mining' },
  { category: 'Multimodal & NLP', items: 'CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL' },
  { category: 'ML Engineering', items: 'Model Deployment, FastAPI, Pydantic, REST APIs, Docker, GitLab CI, pytest, Ruff, Mypy, Spark RDD, Hadoop, ETL, QLoRA, Quantization, Optimization' },
  { category: 'Tools & APIs', items: 'Hugging Face, Ollama, OpenAI/Gemini API, Cohere, ChromaDB, pgvector, TensorFlow, MongoDB, Databricks, Git, Cursor, Claude, GitHub Copilot, Tableau, Microsoft Excel, PowerPoint' },
  { category: 'Cloud', items: 'AWS (Certified AI Practitioner, Certified Cloud Practitioner)' },
];

export const experience = [
  {
    company: 'Momentuum Blue (A Coforge Company)',
    location: 'Princeton, New Jersey',
    label: 'Cross-Industry Enterprise AI',
    role: 'Associate Forward Deployed Engineer',
    period: 'Aug 2026 \u2013 Present',
    current: true,
    project: 'Momentuum Blue enterprise AI delivery',
    // `brief` is the compact version used in the chatbot prompt (src/data/qaContext.js).
    brief: 'Agentic workflows and end-to-end RAG pipelines to Momentuum Blue delivery standards with a fixed eval harness for retrieval recall, answer quality, and citations; local-first inference with a swappable model and data store; built a claims-intake API, a task tracker, and a support-ticket service (tests, code review, server-ready package); completed demoing and customer engagement training. Policy RAG harness: 1.0 retrieval recall and answer accuracy on 16 questions.',
    bullets: [
      'Building agentic workflows and end-to-end RAG pipelines to Momentuum Blue delivery standards, with a fixed evaluation harness for retrieval recall, answer quality, and citations.',
      'Designing deployment choices that keep inference local when a cloud call is unnecessary and keep the model and data store swappable.',
      'Built a claims-intake API, a task tracker, and a support-ticket service through tests, code review, and a server-ready package; a valid loss notice is recorded and an edge notice is refused with a typed reason.',
      'Completed demoing and customer engagement training for client-facing delivery.',
      'The policy RAG harness scored retrieval recall and answer accuracy of 1.0 on 16 questions.',
    ],
    stack: 'Python, LangGraph, FastAPI, ChromaDB, pgvector, BM25 hybrid retrieval, Cohere reranking, local Gemma models, pytest, Docker, GitLab CI',
  },
  {
    company: 'Starcycle',
    location: 'United States',
    label: 'LegalTech / Corporate Dissolution Platform',
    brief: 'Internal Slack-based RAG assistant (incremental sync, Vue frontend, PII redaction); CRM integration planning with a staged, payload-validating sync workflow; national compliance datasets, late-fee and closure indexes, and cross-system data reconciliation.',
    role: 'Data Science Intern',
    period: 'Feb 2026 \u2013 May 2026',
    bullets: [
      'Built an internal Slack-based assistant for Q&A, summaries, and insights using RAG architecture, with incremental data sync, a Vue frontend, and PII redaction safeguards.',
      'Led CRM integration planning (API research, webhook architecture, field mapping) and designed a staged sync workflow that validates payloads before writing to production.',
      'Built national compliance datasets with tiered state coverage, machine-readable exports, late fee and closure reference indexes, and contributed to a data reconciliation pipeline across multiple internal and third-party systems.',
    ],
  },
  {
    company: 'Onawa Pet',
    location: 'United States',
    label: 'PetTech',
    brief: 'RAG with OpenAI function calling + Firebase over 500+ voice notes (pet-health analytics); multimodal pipeline cutting manual review 60%; Scala + Redis visualization engine (45% faster).',
    role: 'AI/ML Engineer Intern',
    period: 'May 2025 \u2013 Jul 2025',
    link: { label: 'pet-voice-notes on GitHub', url: 'https://github.com/dhyeynala/pet-voice-notes' },
    bullets: [
      'Built a RAG system with OpenAI Function Calling + Firebase handling 500+ voice notes, delivering actionable pet health analytics across 3 cross-team dashboards to inform product decisions.',
      'Developed a multimodal AI pipeline processing 200+ audio files with real-time speech transcription, PDF analysis, and summarization using TensorFlow and Transformers, reducing manual document review time by 60%.',
      'Created a visualization engine in Scala supporting 12+ chart types with Redis caching, cutting data representation render time by 45% and enabling real-time analytics for 100+ daily queries.',
    ],
  },
  {
    company: 'Genpact',
    location: 'India',
    label: 'IT Consulting / Digital Transformation',
    brief: 'Conversational purchase-order automation assistant with multi-document querying; GPT-4 prompt sets with custom evaluation metrics.',
    role: 'Generative AI Engineer Intern',
    period: 'Apr 2024 \u2013 Jun 2024',
    bullets: [
      'Built a conversational assistant for purchase-order (PO) automation that analyzed large purchase orders and supported multi-document querying, streamlining processing and improving data accessibility.',
      'Designed and optimized prompt sets with GPT-4 and custom evaluation metrics to test system accuracy, relevance, and robustness in production, resulting in higher query precision and more reliable responses.',
      'Contributed to scalable deployment workflows, improving inference performance and reliability for enterprise use, which led to increased system efficiency and reduced downtime.',
    ],
  },
];

export const resumeProjects = [
  {
    name: 'Policy RAG Assistant',
    link: 'https://github.com/DHYEY166/rag',
    bullets: [
      'Built a retrieval-augmented assistant over policy documents using Gemma models served by Ollama, a Chroma vector store, and Cohere reranking.',
      'Wrote a fixed-set evaluation harness (pytest) that scored retrieval recall and answer accuracy of 1.0 on 16 questions.',
    ],
  },
  {
    name: 'BEACON | Emergency Decision Support for First Responders',
    link: 'https://github.com/DHYEY166/BEACON',
    bullets: [
      'Fine-tuned Gemma 4 E4B with QLoRA on WHO/SPHERE/IMCI emergency protocols to return urgency, immediate actions, things to avoid, and escalation signs in plain language.',
      'Offline-capable BM25 RAG with voice, photo, or text input and spoken guidance in 6 languages; FastAPI backend (Docker), Next.js web app, and React Native mobile app.',
    ],
  },
  {
    name: 'MultiLLM | Intelligent Multi-Model AI System',
    link: 'https://github.com/DHYEY166/MultiLLM',
    period: 'Sep 2025 \u2013 Dec 2025',
    bullets: [
      'Built privacy-first AI platform with real-time streaming chat, intelligent task routing across 5+ local Ollama models (Llama 3.2, DeepSeek Coder, Phi3), and dynamic model selection with latency tracking.',
      'Engineered multi-format knowledge base supporting 10+ file types with semantic chunking, intelligent context retrieval, and user-controlled streaming responses.',
      'Implemented Google OAuth, per-user data isolation, Redis session management, rate limiting (100 req/15min), and GDPR/HIPAA compliance features.',
    ],
  },
  {
    name: 'ChatDB | Database Management and Visualization Tool',
    period: 'Aug 2024 \u2013 Jan 2025',
    link: 'https://github.com/DHYEY166/ChatDB',
    bullets: [
      'Integrated LLMs to convert natural language inputs into SQL queries, enhancing user accessibility.',
      'Supported multiple databases (SQLite, MySQL, PostgreSQL) with a user-friendly connection interface.',
      'Enabled data visualization using Matplotlib to generate bar, line, and scatter plots from SQL query results.',
    ],
  },
];

export const achievements = [
  'Origin Weekend: IMPACT S26 \u2013 First Place: won a USC Viterbi startup launch sprint organized with USC, Google, and TIE Hub.',
  'Graduate Teaching Assistant, Foundations of Data Management (DSCI 551 graduate and DSCI 351 undergraduate), USC: supported 100+ students, led weekly sections, and designed assignments with faculty.',
  'AWS re:Invent All Builders Welcome Grant recipient (2025) and Alumni Advisor (2026).',
  "Dean's List (2023).",
  'Advanced Deep Learning Research, National University of Singapore: conducted privacy-preserving facial analysis research, improving model accuracy by 10% and reducing TensorFlow inference latency by 40% on 3\u00d7 larger batches.',
];
