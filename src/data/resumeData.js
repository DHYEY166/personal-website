export const education = [
  {
    school: 'University of Southern California',
    period: 'Aug 2024 \u2013 May 2026',
    degree: 'Master of Science, Applied Data Science',
    gpa: 'GPA: 3.73',
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
  { category: 'ML & GenAI', items: 'Recommender Systems, Transformers, CNN/RNN/LSTM, RAG, Generative AI, Foundation Models, Statistical Modeling, Data Mining' },
  { category: 'Multimodal & NLP', items: 'CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL' },
  { category: 'ML Engineering', items: 'Model Deployment, Spark RDD, Hadoop, ETL, Quantization, Optimization' },
  { category: 'Tools & APIs', items: 'TensorFlow, OpenAI/Gemini API, SQL, MongoDB, Databricks, Git, Tableau, Microsoft Excel, PowerPoint' },
  { category: 'Cloud', items: 'AWS (Certified Cloud Practitioner)' },
];

export const experience = [
  {
    company: 'Starcycle, United States',
    role: 'Data Science Co-op',
    period: 'Feb 2026 \u2013 May 2026',
    bullets: [
      'Prototyping Python tools and ETL pipelines that parse 1K+ inputs and automate entity and tax data enrichment to cut manual ops effort.',
      'Generating synthetic and knowledge-graph-backed datasets and building 5+ dashboards that surface platform and funnel bottlenecks.',
      'Designing and evaluating 50+ prompts, context strategies, and API/MCP integrations to improve internal AI tool quality and reliability.',
    ],
  },
  {
    company: 'nala, United States',
    role: 'AI/ML Engineer Intern',
    period: 'May 2025 \u2013 Aug 2025',
    bullets: [
      'Built RAG system with OpenAI Function Calling + Firebase handling 500+ voice notes, delivering actionable pet health analytics across 3 cross-team dashboards to inform product decisions.',
      'Developed a multimodal AI pipeline processing 200+ audio files with real-time speech transcription, PDF analysis, and summarization using TensorFlow and Transformers, reducing manual document review time by 60%.',
      'Created a visualization engine in Scala supporting 12+ chart types with Redis caching, cutting data representation render time by 45% and enabling real-time analytics for 100+ daily queries.',
    ],
  },
  {
    company: 'Genpact, India',
    role: 'Generative AI Engineer Intern',
    period: 'Apr 2024 \u2013 Jun 2024',
    bullets: [
      'Built an AI-powered PO Automation conversational AI to analyze large purchase orders and enable multi-document querying, resulting in streamlined processing and improved data accessibility.',
      'Designed and optimized prompt sets with GPT-4 and custom evaluation metrics to test system accuracy, relevance, and robustness in production, resulting in higher query precision and more reliable responses.',
      'Contributed to scalable deployment workflows, improving inference performance and reliability for enterprise use, which led to increased system efficiency and reduced downtime.',
    ],
  },
];

export const resumeProjects = [
  {
    name: 'MultiLLM | Intelligent Multi-Model AI System | Deployed Website',
    period: 'Sep 2025 \u2013 Dec 2025',
    bullets: [
      'Built privacy-first AI platform with real-time streaming chat, intelligent task routing across 5+ local Ollama models (Llama 3.2, DeepSeek Coder, Phi3), and dynamic model selection with latency tracking.',
      'Engineered multi-format knowledge base supporting 10+ file types with semantic chunking, intelligent context retrieval, and user-controlled streaming responses.',
      'Deployed production-ready system with Google OAuth, per-user data isolation, Redis session management, rate limiting (100 req/15min), and GDPR/HIPAA compliance features.',
    ],
  },
  {
    name: 'Yelp Recommendation System',
    period: 'Jan 2025 \u2013 May 2025',
    bullets: [
      'Created Spark RDD + XGBoost recommender with 40+ features, applying GLM techniques to rank top 3/120 in accuracy.',
      'Designed cold start features using check-in counts, photo frequency, tip sentiment, and business category embeddings.',
      'Tuned model with confidence-weighted biases and transforms, achieving RMSE of 0.9745 (val) and 0.9734 (test).',
    ],
  },
  {
    name: 'ChatDB | Database Management and Visualization Tool',
    period: 'Aug 2024 \u2013 Jan 2025',
    bullets: [
      'Integrated LLMs to convert natural language inputs into SQL queries, enhancing user accessibility.',
      'Supported multiple databases (SQLite, MySQL, PostgreSQL) with a user-friendly connection interface.',
      'Enabled data visualization using Matplotlib to generate bar, line, and scatter plots from SQL query results.',
    ],
  },
];

export const publications = [
  {
    title: 'Brain Stroke Detection using M.L. Models | IEEE Xplore',
    bullets: [
      'Analyzed 8 ML and DL models with advanced preprocessing techniques for improved feature extraction.',
      'Improved brain stroke detection accuracy by 15% using ensemble methods and advanced preprocessing.',
    ],
  },
];

export const achievements = [
  'Origin Weekend: IMPACT S26 \u2013 First Place: Won a USC startup launch sprint organised with Google and TIE Hub \u2013 USC Viterbi.',
  'Teaching Assistant, Foundations of Data Management: Appointed Teaching Assistant for DSCI 551 (Graduate course) and DSCI 351 (Undergraduate course).',
  'Advanced Deep Learning Research, National University of Singapore: Conducted privacy-preserving facial analysis research at National University of Singapore, improving model accuracy by 10% and reducing TensorFlow inference latency by 40% on 3\u00d7 larger batches.',
];
