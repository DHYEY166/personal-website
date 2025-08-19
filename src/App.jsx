import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";

// API Configuration for Chatbot
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY;

const QA_CONTEXT = `Dhyey Desai is an AI/ML Engineer and Data Scientist based in Los Angeles, California. Email: dhyeydes@usc.edu. Education: M.S. in Applied Data Science (USC, 2024–2026), B.Tech in Computer Science (Manipal University Jaipur, 2020–2024). Skills: Recommender Systems, Transformers, CNN/RNN/LSTM, RAG, Generative AI, Foundation Models, CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL, Model Deployment, Spark RDD, Hadoop, ETL, Quantization, Optimization, PyTorch, TensorFlow, OpenAI API, Gemini API, SQL, MongoDB, Databricks, Git. Experience: nala (AI/ML Engineer Intern, 2025), Genpact (Generative AI Intern, 2024), NUS (Deep Learning Research Intern, 2022). Projects: Yelp Recommendation Challenge (Top 3/120), ChatDB, Hate Speech Detection. Publications: Brain Stroke Detection (IEEE Xplore, 2023). Achievements: Teaching Assistant at USC, PwC Launchpad Champion, Top 3 in recommender competition.`;

// Fallback responses for common questions
const getFallbackResponse = (question) => {
  const q = question.toLowerCase();
  
  // Check for specific questions first (most specific to least specific)
  if (q.includes('project') || q.includes('yelp') || q.includes('chatdb') || q.includes('hate speech')) {
    return `DHYEY'S KEY PROJECTS

YELP RECOMMENDATION CHALLENGE (Top 3/120)
January 2025 - May 2025: Built hybrid Spark RDD + XGBoost recommender system, Engineered 40+ features from user, business, behavioral data, Achieved RMSE of 0.9734 on test set

CHATDB - Database Management Tool
August 2024 - January 2025: LLM-powered natural language to SQL converter, Supports SQLite, MySQL, PostgreSQL databases, Integrated data visualization with multiple chart types

HATE SPEECH DETECTION SYSTEM
October 2023 - July 2024: BERT-based classifier with NER and TF-IDF, Achieved 96% F1-score performance, Implemented bias-aware NLP pipeline

BRAIN STROKE DETECTION (IEEE Published)
February 2023: Analyzed 8 ML/DL models with advanced preprocessing, Improved detection accuracy by 15% using ensembles, Published in IEEE Xplore`;
  }
  
  if (q.includes('education') || q.includes('degree') || q.includes('study') || q.includes('university')) {
    return `DHYEY'S EDUCATION

CURRENT:
Master of Science in Applied Data Science, University of Southern California (USC), August 2024 - May 2026

COMPLETED:
Bachelor of Technology in Computer Science & Engineering, Manipal University Jaipur, Rajasthan, July 2020 - May 2024

ACADEMIC ACHIEVEMENTS:
Teaching Assistant for Graduate & Undergraduate courses, Strong foundation in ML, Data Science, and Software Engineering`;
  }
  
  if (q.includes('skill') || q.includes('technology') || q.includes('programming')) {
    return `DHYEY'S TECHNICAL SKILLS

ML & GENERATIVE AI:
Recommender Systems, Transformers, CNN/RNN/LSTM, RAG (Retrieval Augmented Generation), Foundation Models, Generative AI, Neural Networks

MULTIMODAL & NLP:
Computer Vision, Natural Language Processing, Named Entity Recognition, Sentiment Analysis, Text-to-SQL, Multimodal Pretraining

ML ENGINEERING:
Model Deployment, Quantization, Optimization, Spark RDD, Hadoop, ETL Pipelines

TOOLS & PLATFORMS:
PyTorch, TensorFlow, Scikit-Learn, OpenAI API, Gemini API, Databricks, SQL, MongoDB, Git, Docker`;
  }
  
  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('intern')) {
    return `DHYEY'S PROFESSIONAL EXPERIENCE

NALA (AI/ML Engineer Intern)
May 2025 - July 2025: Developing intelligent RAG systems with OpenAI Function Calling, Building multimodal AI pipelines with real-time transcription, Creating dynamic visualization engines with 12+ chart types

GENPACT (Generative AI Intern)
April 2024 - June 2024: Built privacy-safe GenAI models for finance sector, Improved ML pipeline efficiency by 20%, Designed bias evaluation metrics

NATIONAL UNIVERSITY OF SINGAPORE (Research Intern)
June 2022 - August 2022: Spearheaded privacy-preserving facial analysis research, Improved model accuracy by 10% while reducing bias, Reduced inference time by 40% for larger batches`;
  }
  
  if (q.includes('summary') || q.includes('resume') || q.includes('overview') || (q.includes('tell me about') && !q.includes('project') && !q.includes('education') && !q.includes('skill') && !q.includes('experience'))) {
    return `DHYEY DESAI - RESUME SUMMARY

EDUCATION:
MS in Applied Data Science (USC, 2024-2026), BTech Computer Science (Manipal University, 2020-2024)

EXPERIENCE:
AI/ML Engineer Intern at nala (2025), GenAI Intern at Genpact (2024), Research Intern at NUS (2022)

TECHNICAL SKILLS:
ML & GenAI (Transformers, RAG, Foundation Models), Languages (Python, R, SQL, JavaScript), Tools (PyTorch, TensorFlow, Spark, MongoDB)

KEY PROJECTS:
Yelp Recommendation Challenge (Top 3/120), ChatDB - Natural Language to SQL Tool, Hate Speech Detection (96% F1-score)

PUBLICATIONS:
Brain Stroke Detection (IEEE Xplore, 2023)

ACHIEVEMENTS:
USC Teaching Assistant, PwC Launchpad Champion, Top 3 Recommender Competition`;
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
Data Scientist and ML Engineer from Los Angeles, Currently pursuing MS in Applied Data Science at USC, Hands-on experience in AI/ML at leading companies

PROFESSIONAL BACKGROUND:
AI/ML Engineer Intern at nala, Generative AI Intern at Genpact, Deep Learning Research Intern at NUS

EXPERTISE:
Transformers and Foundation Models, Natural Language Processing, Computer Vision, Recommender Systems, Machine Learning Engineering

RECOGNITION:
USC Teaching Assistant, Top 3 in competitive ML challenges, IEEE published researcher, PwC Launchpad Champion`;
  }
  
  if (q.includes('achievement') || q.includes('award') || q.includes('recognition')) {
    return `DHYEY'S ACHIEVEMENTS & RECOGNITION

ACADEMIC EXCELLENCE:
Teaching Assistant for DSCI 551 (Graduate Level), Teaching Assistant for DSCI 351 (Undergraduate Level), Foundations of Data Management at USC

COMPETITION SUCCESS:
Top 3 out of 120 students in USC Yelp Recommendation Challenge, Demonstrated accuracy and efficiency in ML competitions, University-scale recommender system competition

INDUSTRY RECOGNITION:
University Champion for PwC Launchpad Program, Excellence in professional development program

RESEARCH CONTRIBUTIONS:
Published research in IEEE Xplore, Brain Stroke Detection using Machine Learning Models, Contributing to academic knowledge in healthcare AI`;
  }
  
  return "I can help you learn about Dhyey's background! Try asking: 'Give me a summary of his resume', 'What are his technical skills?', 'Tell me about his projects', or 'What's his experience?'";
};

// NEW: Top Navigation Bar Component
function TopNavigation() {
  const location = useLocation();
  
  const navStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '15px 30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(10px)',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    textDecoration: 'none',
    color: '#fff',
  };

  const profileImgStyle = {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(255,255,255,0.3)',
    transition: 'transform 0.3s ease',
  };

  const menuStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const linkStyle = (isActive) => ({
    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
    background: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
    padding: '10px 18px',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    fontSize: 14,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
    border: isActive ? '1px solid rgba(255,255,255,0.3)' : '1px solid transparent',
  });

  const socialStyle = {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  };

  const socialIconStyle = {
    width: 35,
    height: 35,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
  };

  return (
    <nav style={navStyle}>
      <Link to="/chatbot" style={logoStyle}>
        <img 
          src="/profile.jpg" 
          alt="Dhyey Desai" 
          style={profileImgStyle}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div>
          <h3 style={{margin: 0, fontSize: 18, fontWeight: 700}}>Dhyey Desai</h3>
          <p style={{margin: 0, opacity: 0.9, fontSize: 12}}>AI/ML Engineer</p>
        </div>
      </Link>
      
      <div style={menuStyle}>
        {[
          { path: '/chatbot', icon: '', label: 'Ask Dhyey' },
          { path: '/about', icon: '', label: 'About' },
          { path: '/skills', icon: '', label: 'Skills' },
          { path: '/projects', icon: '', label: 'Projects' },
          { path: '/resume', icon: '', label: 'Resume' },
          { path: '/contact', icon: '', label: 'Contact' }
        ].map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            style={linkStyle(location.pathname === item.path || (location.pathname === '/' && item.path === '/chatbot'))}
            onMouseOver={(e) => {
              if (!(location.pathname === item.path || (location.pathname === '/' && item.path === '/chatbot'))) {
                e.target.style.background = 'rgba(255,255,255,0.15)';
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => {
              if (!(location.pathname === item.path || (location.pathname === '/' && item.path === '/chatbot'))) {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{fontSize: 16}}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div style={socialStyle}>
        <a href="https://www.linkedin.com/in/dhyey-desai-80659a216" target="_blank" rel="noopener noreferrer" 
           style={socialIconStyle}
           onMouseOver={(e) => {
             e.target.style.background = 'rgba(0,119,181,0.8)';
             e.target.style.transform = 'translateY(-2px)';
           }}
           onMouseOut={(e) => {
             e.target.style.background = 'rgba(255,255,255,0.1)';
             e.target.style.transform = 'translateY(0)';
           }}>
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.88v1.23h.04c.4-.75 1.38-1.54 2.85-1.54 3.05 0 3.62 2.01 3.62 4.62v4.69z"/>
          </svg>
        </a>
        <a href="https://github.com/DHYEY166" target="_blank" rel="noopener noreferrer"
           style={socialIconStyle}
           onMouseOver={(e) => {
             e.target.style.background = 'rgba(36,41,46,0.8)';
             e.target.style.transform = 'translateY(-2px)';
           }}
           onMouseOut={(e) => {
             e.target.style.background = 'rgba(255,255,255,0.1)';
             e.target.style.transform = 'translateY(0)';
           }}>
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.527.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.399 3-.404 1.02.005 2.04.137 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.649.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.587 8.2-6.086 8.2-11.385 0-6.63-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}

// Enhanced About Component (Reduced font sizes)
function About() {
  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease-out',
  };

  const heroStyle = {
    textAlign: 'center',
    marginBottom: 60,
    padding: '60px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 25,
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 15px 50px rgba(102, 126, 234, 0.4)',
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    padding: 40,
    marginBottom: 30,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: 30,
    marginBottom: 40,
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}
      </style>
      
      <div style={heroStyle}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }}></div>
        <h1 style={{
          fontSize: 48, 
          fontWeight: 800, 
          marginBottom: 18,
          textShadow: '0 4px 8px rgba(0,0,0,0.3)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          Hello, I'm Dhyey
        </h1>
        <p style={{
          fontSize: 20, 
          fontWeight: 300,
          marginBottom: 25,
          opacity: 0.95
        }}>
          Data Scientist & Machine Learning Engineer
        </p>
        <p style={{
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 550,
          margin: '0 auto',
          opacity: 0.9
        }}>
          Passionate about applying AI and machine learning to solve complex real-world problems. 
          Currently pursuing MS in Applied Data Science at USC.
        </p>
      </div>

      <div 
        style={cardStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.12)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
        }}
      >
        <div style={infoGridStyle}>
          {[
            { icon: '', label: 'Birthday', value: '6th December 2002' },
            { icon: '', label: 'Location', value: 'Los Angeles, California' },
            { icon: '', label: 'Email', value: 'dhyeydes@usc.edu' },
            { icon: '', label: 'Degree', value: 'MS Applied Data Science, USC' },
            { icon: '', label: 'Age', value: '22 years old' }
          ].map((item, index) => (
            <div key={index} style={{
              background: 'linear-gradient(135deg, #f6f9fc, #ffffff)',
              padding: 20,
              borderRadius: 15,
              border: '1px solid rgba(102, 126, 234, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{fontSize: 28, marginBottom: 12}}>{item.icon}</div>
              <div style={{fontWeight: 700, color: '#2c3e50', marginBottom: 6, fontSize: 14}}>{item.label}</div>
              <div style={{color: '#5a6c7d', fontSize: 13}}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '2px solid #f1f3f4',
          paddingTop: 30,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          borderRadius: 15,
          padding: 30,
          marginTop: 15
        }}>
          <h3 style={{fontSize: 24, fontWeight: 700, color: '#2c3e50', marginBottom: 25, textAlign: 'center'}}>
            About Me
          </h3>
          {[
            "I am a Data Scientist with a focus on applying AI and machine learning to solve complex problems. As an MSc student in Applied Data Science at USC, I integrate interdisciplinary approaches to advance the field and tackle real-world challenges.",
            "At Genpact, I contributed to the Gen AI Finance Project, enhancing financial decision-making through AI and ML, achieving a 20% efficiency increase and a 15% improvement in decision accuracy. This role expanded my expertise in computer vision and NLP, developed during my research assistantship at Manipal University.",
            "My projects include developing a high-accuracy hate speech detection system (95% accuracy), breast cancer semantic segmentation (97.53% accuracy), and achieving 99% diagnostic accuracy for Multiple Sclerosis detection using deep learning models on MRI images."
          ].map((paragraph, index) => (
            <p key={index} style={{
              fontSize: 16, 
              lineHeight: 1.7, 
              color: '#4a5568', 
              textAlign: 'justify',
              marginBottom: 20
            }}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Skills Component (Reduced sizes)
function Skills() {
  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease-out',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 60,
  };

  const skillsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 30,
  };

  const skillCardStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    padding: 30,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const skillTagStyle = (color, index) => ({
    display: 'inline-block',
    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    margin: '6px 8px 6px 0',
    boxShadow: `0 6px 20px ${color}40`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
    position: 'relative',
  });

  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: '',
      color: 'linear-gradient(135deg, #667eea, #764ba2)',
      skills: [
        { name: 'Python', color: '#3776ab' },
        { name: 'R', color: '#276dc3' },
        { name: 'SQL', color: '#f29111' },
        { name: 'JavaScript', color: '#f7df1e' }
      ]
    },
    {
      title: 'Machine Learning & AI',
      icon: '',
      color: 'linear-gradient(135deg, #f093fb, #f5576c)',
      skills: [
        { name: 'TensorFlow', color: '#ff6f00' },
        { name: 'PyTorch', color: '#ee4c2c' },
        { name: 'Scikit-Learn', color: '#f7931e' },
        { name: 'OpenAI API', color: '#412991' },
        { name: 'Transformers', color: '#ffd21e' }
      ]
    },
    {
      title: 'Data Analysis',
      icon: '',
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      skills: [
        { name: 'Pandas', color: '#150458' },
        { name: 'NumPy', color: '#013243' },
        { name: 'Matplotlib', color: '#11557c' },
        { name: 'Seaborn', color: '#4c72b0' },
        { name: 'Databricks', color: '#ff3621' }
      ]
    },
    {
      title: 'Tools & Platforms',
      icon: '',
      color: 'linear-gradient(135deg, #fa709a, #fee140)',
      skills: [
        { name: 'Git', color: '#f05032' },
        { name: 'Docker', color: '#2496ed' },
        { name: 'Jupyter', color: '#f37626' },
        { name: 'MongoDB', color: '#47a248' },
        { name: 'Spark', color: '#e25a1c' }
      ]
    }
  ];

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      <div style={headerStyle}>
        <h1 style={{
          fontSize: 42, 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 18
        }}>
          Technical Skills
        </h1>
        <p style={{fontSize: 18, color: '#7f8c8d', fontWeight: 300}}>
          My expertise across various technologies and frameworks
        </p>
      </div>

      <div style={skillsGridStyle}>
        {skillCategories.map((category, categoryIndex) => (
          <div 
            key={categoryIndex}
            style={skillCardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: category.color,
              borderRadius: '20px 20px 0 0'
            }}></div>
            
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 25}}>
              <span style={{fontSize: 30, marginRight: 12}}>{category.icon}</span>
              <h3 style={{color: '#2c3e50', fontSize: 18, fontWeight: 700, margin: 0}}>
                {category.title}
              </h3>
            </div>
            
            <div>
              {category.skills.map((skill, index) => (
                <span
                  key={index}
                  style={skillTagStyle(skill.color, index)}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = `0 10px 30px ${skill.color}60`;
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `0 6px 20px ${skill.color}40`;
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Projects Component (Reduced sizes)
function Projects() {
  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease-out',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 60,
  };

  const projectsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 30,
  };

  const projectCardStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    padding: 30,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    height: 'fit-content',
  };

  const projects = [
    {
      title: 'Yelp Recommendation Challenge',
      badge: { text: 'Top 3/120 Students', color: '#27ae60' },
      description: 'Built a high-performance hybrid recommender leveraging Spark RDD and XGBoost with 40+ engineered features. Designed cold-start solutions using check-in data, photo frequency, tip sentiment, and business category embeddings. Achieved Top 3 ranking among 120 students.',
      role: 'Lead developer, feature engineer, ML modeler',
      challenge: 'Creating accurate recommendations for new users and items',
      outcome: 'Ranked top 3/120; robust business insights via feature engineering',
      tech: ['Spark RDD', 'XGBoost', 'Python', 'Feature Engineering'],
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      icon: '',
      github: 'https://github.com/DHYEY166/yelp-recommendation-challenge'
    },
    {
      title: 'ChatDB',
      badge: { text: 'LLM Integration', color: '#3498db' },
      description: 'Developed an interactive database management and visualization platform. Integrated LLM-powered natural language querying, allowing users to convert NL inputs to SQL, support multiple databases, and generate instant data visualizations.',
      role: 'Full-stack & AI engineer, product architect',
      challenge: 'Bridging natural language interfaces with secure, multi-database management',
      outcome: 'Live deployment; improved accessibility for non-technical users',
      tech: ['LLMs', 'SQL', 'SQLite', 'MySQL', 'PostgreSQL'],
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      icon: '',
      github: 'https://github.com/DHYEY166/chatdb'
    },
    {
      title: 'Hate Speech Detection',
      badge: { text: '96% F1-Score', color: '#e67e22' },
      description: 'Engineered a bias-aware NLP pipeline with BERT and TF-IDF for detecting hate speech and offensive language. Tuned NER and sentiment models for efficient real-time inference, achieving 96% F1-score.',
      role: 'ML developer, model optimizer',
      challenge: 'Ensuring both fairness and efficiency of detection models',
      outcome: '96% F1-score; production-ready models for content moderation',
      tech: ['BERT', 'NLP', 'TF-IDF', 'Python', 'Machine Learning'],
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      icon: '',
      github: 'https://github.com/DHYEY166/hate-speech-detection'
    },
    {
      title: 'Breast Cancer Segmentation',
      badge: { text: '97.53% Accuracy', color: '#2ecc71' },
      description: 'Created deep learning models for medical image segmentation of breast cancer tumors. Implemented advanced preprocessing and optimization techniques to achieve 97.53% accuracy.',
      role: 'Deep learning engineer',
      challenge: 'Accurately segmenting tumors in heterogeneous medical images',
      outcome: '97.53% accuracy; supports early diagnosis in clinical workflows',
      tech: ['Deep Learning', 'Computer Vision', 'Medical Imaging', 'Python'],
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      icon: '',
      github: 'https://github.com/DHYEY166/breast-cancer-segmentation'
    },
    {
      title: 'Multiple Sclerosis Detection',
      badge: { text: '99% Diagnostic Accuracy', color: '#9b59b6' },
      description: 'Designed CNN-based diagnostic tools for Multiple Sclerosis using MRI scans. Employed sophisticated preprocessing to attain 99% diagnostic accuracy across varied datasets.',
      role: 'Researcher, DL practitioner',
      challenge: 'Extracting reliable diagnostic signals from complex medical imagery',
      outcome: '99% accuracy; improved early detection for neurologists',
      tech: ['CNN', 'TensorFlow', 'MRI Analysis', 'Medical AI'],
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      icon: '',
      github: 'https://github.com/DHYEY166/multiple-sclerosis-detection'
    },
    {
      title: 'Autism Detection Using Deep Learning Techniques',
      badge: { text: 'Research Project', color: '#e74c3c' },
      description: 'Conducted research on AI-driven facial analysis for early autism diagnosis. Enhanced model accuracy by 10% while developing bias-reduction architectures and improving batch inference by 40%.',
      role: 'Researcher, system architect',
      challenge: 'Reducing dataset bias and improving real-time performance',
      outcome: 'Improved diagnostic precision and efficiency in batch inference',
      tech: ['Privacy AI', 'Facial Recognition', 'TensorFlow', 'Research'],
      gradient: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      icon: '',
      github: 'https://github.com/DHYEY166/autism-detection'
    }
  ];

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{
          fontSize: 42, 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 18
        }}>
          Featured Projects
        </h1>
        <p style={{fontSize: 18, color: '#7f8c8d', fontWeight: 300}}>
          Showcase of my work and achievements in AI/ML
        </p>
      </div>

      <div style={projectsGridStyle}>
        {projects.map((project, index) => (
          <div 
            key={index}
            style={projectCardStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 25px 70px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 5,
              background: project.gradient,
              borderRadius: '20px 20px 0 0'
            }}></div>
            
            <div style={{display: 'flex', alignItems: 'center', marginBottom: 18}}>
              <span style={{fontSize: 28, marginRight: 12}}>{project.icon}</span>
              <h3 style={{color: '#2c3e50', fontSize: 20, fontWeight: 700, margin: 0, flex: 1}}>
                {project.title}
              </h3>
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" 
                   style={{
                     marginLeft: 12,
                     padding: '6px 12px',
                     background: 'linear-gradient(135deg, #333, #555)',
                     color: '#fff',
                     borderRadius: 12,
                     textDecoration: 'none',
                     fontSize: 12,
                     fontWeight: 600,
                     transition: 'all 0.3s ease'
                   }}
                   onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                   onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                  GitHub
                </a>
              )}
            </div>
            
            <div style={{
              background: `linear-gradient(135deg, ${project.badge.color}20, ${project.badge.color}10)`,
              color: project.badge.color,
              padding: '6px 14px',
              borderRadius: 18,
              fontSize: 12,
              fontWeight: 600,
              display: 'inline-block',
              marginBottom: 20,
              border: `1px solid ${project.badge.color}30`
            }}>
              {project.badge.text}
            </div>
            
            <p style={{
              color: '#4a5568',
              lineHeight: 1.6,
              marginBottom: 20,
              fontSize: 14
            }}>
              {project.description}
            </p>

            {project.role && (
              <div style={{marginBottom: 15}}>
                <div style={{fontWeight: 700, color: '#2c3e50', marginBottom: 6, fontSize: 13}}>
                  Role:
                </div>
                <div style={{color: '#5a6c7d', fontSize: 13}}>
                  {project.role}
                </div>
              </div>
            )}

            {project.challenge && (
              <div style={{marginBottom: 15}}>
                <div style={{fontWeight: 700, color: '#2c3e50', marginBottom: 6, fontSize: 13}}>
                  Challenge:
                </div>
                <div style={{color: '#5a6c7d', fontSize: 13}}>
                  {project.challenge}
                </div>
              </div>
            )}

            {project.outcome && (
              <div style={{marginBottom: 20}}>
                <div style={{fontWeight: 700, color: '#2c3e50', marginBottom: 6, fontSize: 13}}>
                  Outcome:
                </div>
                <div style={{color: '#5a6c7d', fontSize: 13}}>
                  {project.outcome}
                </div>
              </div>
            )}
            
            <div style={{
              borderTop: '2px solid #f1f3f4',
              paddingTop: 20
            }}>
              <div style={{fontWeight: 700, color: '#2c3e50', marginBottom: 12, fontSize: 14}}>
                Technologies Used:
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    style={{
                      background: 'linear-gradient(135deg, #f6f9fc, #ffffff)',
                      color: '#5a6c7d',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 500,
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #667eea20, #764ba220)';
                      e.target.style.color = '#667eea';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #f6f9fc, #ffffff)';
                      e.target.style.color = '#5a6c7d';
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Resume Component (Reduced sizes)
function Resume() {
  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease-out',
  };

  const sectionStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    padding: 35,
    marginBottom: 30,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const headingStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontSize: 26,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #667eea, #764ba2)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: 25,
  };

  const subheadingStyle = { 
    fontWeight: 700, 
    color: '#3498db', 
    fontSize: 16, 
    margin: '20px 0 8px 0',
    borderLeft: '3px solid #3498db',
    paddingLeft: 12,
  };

  const listStyle = { 
    margin: 0, 
    paddingLeft: 20, 
    color: '#4a5568', 
    fontSize: 14, 
    lineHeight: 1.7 
  };

  return (
    <div style={containerStyle}>
      <div style={{textAlign: 'center', marginBottom: 50}}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 18
        }}>
          Resume
        </h1>
        <p style={{fontSize: 18, color: '#7f8c8d', fontWeight: 300}}>
          Complete professional background and achievements
        </p>
      </div>

      {/* Education */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Education</div>
        <div style={subheadingStyle}>University of Southern California <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(08/24 – 05/26)</span></div>
        <div style={{fontSize: 16, color: '#2c3e50', marginBottom: 12}}>
          Master of Science in Applied Data Science
        </div>
        <div style={subheadingStyle}>Manipal University Jaipur, Rajasthan <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(07/20 – 05/24)</span></div>
        <div style={{fontSize: 16, color: '#2c3e50'}}>
          Bachelor of Technology in Computer Science and Engineering
        </div>
      </div>

      {/* Technical Skills */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Technical Skills</div>
        <ul style={listStyle}>
          <li><b>Programming Languages:</b> Python, SQL, Java</li>
          <li><b>ML & GenAI:</b> Recommender Systems, Transformers, CNN/RNN/LSTM, RAG, Generative AI, Foundation Models</li>
          <li><b>Multimodal & NLP:</b> CV, NLP, NER, Sentiment Analysis, Multimodal Pretraining, Text-to-SQL</li>
          <li><b>ML Engineering:</b> Model Deployment, Spark RDD, Hadoop, ETL, Quantization, Optimization</li>
          <li><b>Tools & APIs:</b> TensorFlow, OpenAI/Gemini API, SQL, MongoDB, Databricks, Git, Tableau, Microsoft Excel, PowerPoint</li>
        </ul>
      </div>

      {/* Professional Experience */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Professional Experience</div>
        <div style={subheadingStyle}>nala, United States | AI/ML Engineer Intern <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(05/25 – 08/25)</span></div>
        <ul style={listStyle}>
          <li>Built RAG system with OpenAI Function Calling + Firebase, delivering actionable pet health analytics for cross-team insights.</li>
          <li>Developed multimodal AI pipeline with real-time speech transcription, PDF analysis, and intelligent summarization.</li>
          <li>Created dynamic visualization engine with 12+ chart types and intelligent caching for optimal performance.</li>
        </ul>
        <div style={subheadingStyle}>Genpact, India | Generative AI Engineer Intern <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(04/24 – 06/24)</span></div>
        <ul style={listStyle}>
          <li>Built AI-powered PO Automation conversational AI to analyze large purchase orders and enable multi-document querying.</li>
          <li>Designed and optimized prompt sets to test system accuracy, relevance, and robustness in production environments.</li>
          <li>Contributed to scalable deployment workflows, improving inference performance and reliability for enterprise use.</li>
        </ul>
        <div style={subheadingStyle}>National University of Singapore (NUS), Singapore | Deep Learning Research Intern <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(06/22 – 08/22)</span></div>
        <ul style={listStyle}>
          <li>Spearheaded privacy-preserving facial analysis research, improving accuracy by 10% while reducing bias.</li>
          <li>Architected deep learning systems in TensorFlow, reducing inference time by 40% for 3x larger batches.</li>
          <li>Pioneered with research team and NUS professors on novel CNN architectures for image analysis.</li>
        </ul>
      </div>

      {/* Projects */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Projects</div>
        <div style={subheadingStyle}>Yelp Recommendation Challenge | Ranked Top 3 out of 120 <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(01/25 – 05/25)</span></div>
        <ul style={listStyle}>
          <li>Created Spark RDD + XGBoost recommender with 40+ features, applying GLM techniques to rank top 3/120 in accuracy.</li>
          <li>Designed cold start features using check-in counts, photo frequency, tip sentiment, and business category embeddings.</li>
          <li>Tuned model with confidence-weighted biases and transforms, achieving RMSE of 0.9745 (val) and 0.9734 (test).</li>
        </ul>
        <div style={subheadingStyle}>ChatDB | Database Management and Visualization Tool <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(08/24 – 01/25)</span></div>
        <ul style={listStyle}>
          <li>Integrated LLMs to convert natural language inputs into SQL queries, enhancing user accessibility.</li>
          <li>Supported multiple databases (SQLite, MySQL, PostgreSQL) with a user-friendly connection interface.</li>
          <li>Enabled data visualization using Matplotlib to generate bar, line, and scatter plots from SQL query results.</li>
        </ul>
        <div style={subheadingStyle}>Hate Speech and Offensive Language Detection | NLP, Python, Machine Learning <span style={{color:'#7f8c8d', fontStyle: 'italic'}}>(10/23 – 07/24)</span></div>
        <ul style={listStyle}>
          <li>Trained BERT-based classifier with NER and TF-IDF, reaching 96% F1-score.</li>
          <li>Implemented bias-aware NLP pipeline with strong sentiment detection performance.</li>
          <li>Deployed models optimized for inference efficiency and memory usage.</li>
        </ul>
      </div>

      {/* Publications */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Publications</div>
        <div style={subheadingStyle}>Brain Stroke Detection using M.L. Models | IEEE Xplore, Feb 2023</div>
        <ul style={listStyle}>
          <li>Analyzed 8 ML and DL models with advanced preprocessing techniques for improved feature extraction.</li>
          <li>Improved brain stroke detection accuracy by 15% using ensemble methods and advanced preprocessing.</li>
        </ul>
      </div>

      {/* Achievements */}
      <div style={sectionStyle}>
        <div style={headingStyle}>Achievements</div>
        <ul style={listStyle}>
          <li>Appointed Teaching Assistant for DSCI 551 (Graduate) & DSCI 351 (Undergrad) - Foundations of Data Management at USC.</li>
          <li>Recognized as University Champion for excellence in PwC Launchpad Program.</li>
        </ul>
      </div>
    </div>
  );
}

// Enhanced Contact Component (Reduced sizes)
function Contact() {
  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '50px 40px',
    animation: 'fadeIn 1s ease-out',
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    padding: 40,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'all 0.3s ease',
    maxWidth: 800,
    margin: '0 auto',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '20px 0',
    borderBottom: '2px solid #f8f9fa',
    transition: 'all 0.3s ease',
    borderRadius: 12,
    marginBottom: 8,
  };

  const contactItems = [
    {
      icon: '',
      title: 'Email',
      value: 'dhyeydes@usc.edu',
      link: 'mailto:dhyeydes@usc.edu',
      color: '#e74c3c'
    },
    {
      icon: '',
      title: 'LinkedIn',
      value: 'dhyey-desai-80659a216',
      link: 'https://www.linkedin.com/in/dhyey-desai-80659a216',
      color: '#0077b5'
    },
    {
      icon: '',
      title: 'GitHub',
      value: 'DHYEY166',
      link: 'https://github.com/DHYEY166',
      color: '#333'
    }
  ];

  return (
    <div style={containerStyle}>
      <div style={{textAlign: 'center', marginBottom: 50}}>
        <h1 style={{
          fontSize: 42, 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 18
        }}>
          Let's Connect!
        </h1>
        <p style={{fontSize: 18, color: '#7f8c8d', fontWeight: 300}}>
          Feel free to reach out for collaborations or opportunities
        </p>
      </div>

      <div style={cardStyle}
           onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.15)'}
           onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.08)'}>
        {contactItems.map((item, index) => (
          <div key={index} style={contactItemStyle}
               onMouseOver={(e) => {
                 e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}10, ${item.color}05)`;
                 e.currentTarget.style.transform = 'translateX(8px)';
                 e.currentTarget.style.borderLeft = `3px solid ${item.color}`;
               }}
               onMouseOut={(e) => {
                 e.currentTarget.style.background = 'transparent';
                 e.currentTarget.style.transform = 'translateX(0)';
                 e.currentTarget.style.borderLeft = 'none';
               }}>
            <div style={{
              fontSize: 32,
              marginRight: 20,
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
              borderRadius: '50%',
              transition: 'all 0.3s ease'
            }}>
              {item.icon}
            </div>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 700, color: '#2c3e50', fontSize: 16, marginBottom: 4}}>
                {item.title}
              </div>
              <a href={item.link} 
                 target={item.title !== 'Email' ? '_blank' : undefined}
                 rel={item.title !== 'Email' ? 'noopener noreferrer' : undefined}
                 style={{
                   color: item.color, 
                   textDecoration: 'none',
                   fontSize: 14,
                   fontWeight: 500,
                   transition: 'all 0.3s ease'
                 }}
                 onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                 onMouseOut={(e) => e.target.style.textDecoration = 'none'}>
                {item.value}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Chatbot Page Component (Reduced sizes)
function ChatbotPage() {
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Hi! I\'m Dhyey\'s AI assistant. Ask me anything about his background, skills, projects, or experience!' }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input }]);
      const userInput = input;
      setInput('');
      setLoading(true);
      
      try {
        const prompt = `${QA_CONTEXT}\n\nUser: ${userInput}\nBot:`;
        const res = await fetch(HUGGINGFACE_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 100, temperature: 0.7, return_full_text: false }
          })
        });
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        let answer = '';
        
        if (Array.isArray(data) && data[0]?.generated_text) {
          answer = data[0].generated_text.replace(prompt, '').trim();
        } else if (data.generated_text) {
          answer = data.generated_text.replace(prompt, '').trim();
        }
        
        if (!answer) {
          answer = getFallbackResponse(userInput);
        }
        
        setMessages(msgs => [...msgs, { from: 'bot', text: answer }]);
      } catch (e) {
        console.error('Chatbot error:', e);
        const fallbackAnswer = getFallbackResponse(userInput);
        setMessages(msgs => [...msgs, { 
          from: 'bot', 
          text: fallbackAnswer
        }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const containerStyle = {
    maxWidth: '100%',
    margin: '0 auto',
    padding: '30px 40px',
    height: 'calc(100vh - 150px)',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 30,
  };

  const chatContainerStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    borderRadius: 20,
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  };

  const chatHeaderStyle = {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    padding: '20px 25px',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const chatBodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '25px',
    background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  };

  const chatInputContainerStyle = {
    padding: '20px 25px',
    background: '#fff',
    borderTop: '2px solid #f1f3f4',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: 12,
  });

  const bubbleStyle = (isUser) => ({
    maxWidth: '75%',
    padding: '14px 20px',
    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
    background: isUser 
      ? 'linear-gradient(135deg, #667eea, #764ba2)'
      : 'linear-gradient(135deg, #f6f9fc, #ffffff)',
    color: isUser ? '#fff' : '#2c3e50',
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 500,
    boxShadow: isUser 
      ? '0 6px 20px rgba(102, 126, 234, 0.3)'
      : '0 6px 20px rgba(0,0,0,0.08)',
    border: isUser ? 'none' : '1px solid rgba(0,0,0,0.05)',
    animation: 'slideInUp 0.3s ease-out',
    whiteSpace: 'pre-line',
  });

  const inputStyle = {
    flex: 1,
    padding: '12px 18px',
    border: '2px solid #e9ecef',
    borderRadius: 20,
    outline: 'none',
    fontSize: 14,
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #f8f9fa, #ffffff)',
  };

  const sendButtonStyle = {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: '#fff',
    border: 'none',
    borderRadius: 20,
    padding: '12px 25px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
  };

  const quickQuestionsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 15,
    justifyContent: 'center',
  };

  const quickQuestionStyle = {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: 16,
    padding: '6px 14px',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#667eea',
    fontWeight: 500,
  };

  const quickQuestions = [
    "What are Dhyey's skills?",
    "Tell me about his education",
    "What projects has he worked on?",
    "What's his work experience?",
    "How can I contact him?"
  ];

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      
      <div style={headerStyle}>
        <h1 style={{
          fontSize: 42, 
          fontWeight: 800, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 18
        }}>
          Ask Dhyey AI
        </h1>
        <p style={{fontSize: 18, color: '#7f8c8d', fontWeight: 300}}>
          Get instant answers about Dhyey's background, skills, and experience
        </p>
      </div>

      <div style={chatContainerStyle}>
        <div style={chatHeaderStyle}>
          {/* Removed emoji for professionalism */}
          <div>
            <h3 style={{margin: 0, fontSize: 20, fontWeight: 700}}>Dhyey's AI Assistant</h3>
            <p style={{margin: 0, opacity: 0.9, fontSize: 14}}>Powered by Hugging Face AI</p>
          </div>
        </div>

        <div style={chatBodyStyle}>
          {messages.map((message, index) => (
            <div key={index} style={messageStyle(message.from === 'user')}>
              <div style={bubbleStyle(message.from === 'user')}>
                {message.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div style={messageStyle(false)}>
              <div style={{...bubbleStyle(false), opacity: 0.7}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#667eea',
                    animation: 'pulse 1.5s ease-in-out infinite'
                  }}></div>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#667eea',
                    animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#667eea',
                    animation: 'pulse 1.5s ease-in-out infinite 0.4s'
                  }}></div>
                  <span style={{marginLeft: 8}}>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div style={quickQuestionsStyle}>
              <p style={{width: '100%', textAlign: 'center', color: '#7f8c8d', marginBottom: 12, fontSize: 14}}>
                Quick questions to get started:
              </p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  style={quickQuestionStyle}
                  onClick={() => setInput(question)}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))';
                    e.target.style.color = '#667eea';
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={chatInputContainerStyle}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask me anything about Dhyey..."
            style={inputStyle}
            disabled={loading}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              ...sendButtonStyle,
              opacity: loading || !input.trim() ? 0.6 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (!loading && input.trim()) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && input.trim()) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)';
              }
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const mainStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    width: '100%',
  };

  const mainContentStyle = {
    width: '100%',
    minHeight: 'calc(100vh - 80px)',
    padding: 0,
    margin: 0,
  };
  
  // Enhanced responsive CSS
  const responsiveStyle = `
    @media (max-width: 768px) {
      nav div:nth-child(2) {
        display: none !important;
      }
      nav {
        padding: 12px 20px !important;
      }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    #root {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    main {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  `;
  
  return (
    <Router>
      <style>{responsiveStyle}</style>
      <div style={mainStyle}>
        <TopNavigation />
        <main style={mainContentStyle}>
          <Routes>
            <Route path="/" element={<ChatbotPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
