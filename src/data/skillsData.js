export const skillCategories = [
  {
    title: 'Programming Languages',
    icon: '',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    skills: [
      { name: 'Python', color: '#3776ab', proficiency: 5 },
      { name: 'SQL', color: '#f29111', proficiency: 5 },
      { name: 'Java', color: '#f89820', proficiency: 4 },
      { name: 'C', color: '#555555', proficiency: 3 },
      { name: 'Scala', color: '#dc322f', proficiency: 3 }
    ]
  },
  {
    title: 'ML & GenAI',
    icon: '',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    skills: [
      { name: 'Recommender Systems', color: '#ff6f00', proficiency: 5 },
      { name: 'Transformers', color: '#ee4c2c', proficiency: 5 },
      { name: 'CNN/RNN/LSTM', color: '#f7931e', proficiency: 4 },
      { name: 'RAG', color: '#412991', proficiency: 5 },
      { name: 'Generative AI', color: '#ffd21e', proficiency: 5 },
      { name: 'Foundation Models', color: '#8e44ad', proficiency: 4 },
      { name: 'Statistical Modeling', color: '#2ecc71', proficiency: 4 },
      { name: 'Data Mining', color: '#e74c3c', proficiency: 4 }
    ]
  },
  {
    title: 'Multimodal & NLP',
    icon: '',
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    skills: [
      { name: 'CV', color: '#150458', proficiency: 4 },
      { name: 'NLP', color: '#013243', proficiency: 5 },
      { name: 'NER', color: '#11557c', proficiency: 4 },
      { name: 'Sentiment Analysis', color: '#4c72b0', proficiency: 4 },
      { name: 'Multimodal Pretraining', color: '#ff3621', proficiency: 4 },
      { name: 'Text-to-SQL', color: '#27ae60', proficiency: 4 }
    ]
  },
  {
    title: 'ML Engineering',
    icon: '',
    color: 'linear-gradient(135deg, #fa709a, #fee140)',
    skills: [
      { name: 'Model Deployment', color: '#f05032', proficiency: 4 },
      { name: 'Spark RDD', color: '#e25a1c', proficiency: 4 },
      { name: 'Hadoop', color: '#2496ed', proficiency: 3 },
      { name: 'ETL', color: '#f37626', proficiency: 4 },
      { name: 'Quantization', color: '#47a248', proficiency: 3 },
      { name: 'Optimization', color: '#9b59b6', proficiency: 4 }
    ]
  },
  {
    title: 'Tools & APIs',
    icon: '',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    skills: [
      { name: 'TensorFlow', color: '#ff6f00', proficiency: 5 },
      { name: 'OpenAI/Gemini API', color: '#412991', proficiency: 5 },
      { name: 'SQL', color: '#f29111', proficiency: 5 },
      { name: 'MongoDB', color: '#47a248', proficiency: 4 },
      { name: 'Databricks', color: '#ff3621', proficiency: 3 },
      { name: 'Git', color: '#f05032', proficiency: 5 },
      { name: 'Tableau', color: '#e97627', proficiency: 4 },
      { name: 'Microsoft Excel', color: '#217346', proficiency: 4 },
      { name: 'PowerPoint', color: '#d24726', proficiency: 4 }
    ]
  },
  {
    title: 'Cloud',
    icon: '',
    color: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
    skills: [
      { name: 'AWS (Certified Cloud Practitioner)', color: '#ff9900', proficiency: 4 }
    ]
  }
];

// Radar chart data derived from categories
export const radarData = [
  { name: 'Languages', level: 85 },
  { name: 'ML/GenAI', level: 95 },
  { name: 'NLP', level: 90 },
  { name: 'ML Eng', level: 80 },
  { name: 'Tools', level: 88 },
  { name: 'Cloud', level: 75 },
];
