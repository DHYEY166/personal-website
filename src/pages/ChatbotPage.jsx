import React, { useState, useRef, useEffect } from 'react';
import {
  buildHuggingFaceInputs,
  HUGGINGFACE_API_URL,
  HUGGINGFACE_API_KEY,
  getFallbackResponse,
} from '../data/qaContext';
import { useTheme } from '../context/ThemeContext';

const quickQuestions = [
  "What are Dhyey's skills?",
  "Tell me about his education",
  "What projects has he worked on?",
  "What's his work experience?",
  "How can I contact him?",
];

export default function ChatbotPage() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Dhyey's AI assistant. Ask me anything about his background, skills, projects, or experience!" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: 'user', text: input }]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      if (!HUGGINGFACE_API_KEY) {
        setMessages((msgs) => [
          ...msgs,
          {
            from: 'bot',
            text: getFallbackResponse(userInput),
          },
        ]);
        return;
      }

      const inputs = buildHuggingFaceInputs(userInput);
      const res = await fetch(HUGGINGFACE_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          parameters: {
            max_new_tokens: 384,
            temperature: 0.35,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        let detail = '';
        try {
          detail = JSON.parse(errBody)?.error || errBody?.slice(0, 200);
        } catch {
          detail = errBody?.slice(0, 200);
        }
        throw new Error(`API ${res.status}${detail ? `: ${detail}` : ''}`);
      }

      const data = await res.json();
      let answer = '';

      if (Array.isArray(data) && data[0]?.generated_text != null) {
        answer = String(data[0].generated_text).trim();
      } else if (data?.generated_text != null) {
        answer = String(data.generated_text).trim();
      }

      if (!answer && data?.[0]?.generated_text == null && typeof data === 'object') {
        const first = Array.isArray(data) ? data[0] : data;
        if (first && typeof first === 'object' && 'summary_text' in first) {
          answer = String(first.summary_text || '').trim();
        }
      }

      if (!answer) {
        answer = getFallbackResponse(userInput);
      }

      setMessages((msgs) => [...msgs, { from: 'bot', text: answer }]);
    } catch (e) {
      console.error('Chatbot error:', e);
      const fallbackAnswer = getFallbackResponse(userInput);
      setMessages((msgs) => [...msgs, { from: 'bot', text: fallbackAnswer }]);
    } finally {
      setLoading(false);
    }
  };

  /* ---- styles ---- */

  const containerStyle = {
    maxWidth: 900,
    margin: '0 auto',
    padding: '100px 24px 40px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: 24,
  };

  const chatContainerStyle = {
    background: theme.glass.background,
    backdropFilter: theme.glass.blur,
    WebkitBackdropFilter: theme.glass.blur,
    border: theme.glass.border,
    borderRadius: 20,
    boxShadow: theme.glass.shadow,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  };

  const chatHeaderStyle = {
    background: theme.accent.gradient,
    color: '#fff',
    padding: '18px 24px',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  };

  const chatBodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };

  const chatInputContainerStyle = {
    padding: '16px 24px',
    background: theme.glass.background,
    backdropFilter: theme.glass.blur,
    WebkitBackdropFilter: theme.glass.blur,
    borderTop: theme.glass.border,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: 4,
  });

  const bubbleStyle = (isUser) => ({
    maxWidth: '75%',
    padding: '14px 20px',
    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
    background: isUser
      ? theme.accent.gradient
      : theme.glass.background,
    backdropFilter: isUser ? 'none' : theme.glass.blur,
    WebkitBackdropFilter: isUser ? 'none' : theme.glass.blur,
    border: isUser ? 'none' : theme.glass.border,
    color: isUser ? '#fff' : theme.text.primary,
    fontSize: 14,
    lineHeight: 1.6,
    fontWeight: 500,
    boxShadow: isUser
      ? '0 6px 20px rgba(102, 126, 234, 0.3)'
      : theme.glass.shadow,
    animation: 'fadeIn 0.3s ease-out',
    whiteSpace: 'pre-line',
  });

  const inputStyle = {
    flex: 1,
    padding: '12px 18px',
    border: theme.glass.border,
    borderRadius: 12,
    outline: 'none',
    fontSize: 14,
    transition: 'all 0.3s ease',
    background: theme.glass.background,
    backdropFilter: theme.glass.blur,
    WebkitBackdropFilter: theme.glass.blur,
    color: theme.text.primary,
  };

  const sendButtonStyle = {
    background: theme.accent.gradient,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 24px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    transition: 'all 0.3s ease',
    boxShadow: theme.accent.glow,
  };

  const quickQuestionsContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    justifyContent: 'center',
  };

  const quickQuestionBtnStyle = {
    background: theme.glass.background,
    backdropFilter: theme.glass.blur,
    WebkitBackdropFilter: theme.glass.blur,
    border: `1px solid ${theme.accent.primary}40`,
    borderRadius: 16,
    padding: '8px 16px',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: theme.accent.primary,
    fontWeight: 500,
  };

  /* ---- render ---- */

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            background: theme.accent.textGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8,
          }}
        >
          Ask Dhyey AI
        </h1>
        <p style={{ fontSize: 16, color: theme.text.secondary, fontWeight: 400 }}>
          Get instant answers about Dhyey's background, skills, and experience
        </p>
      </div>

      <div style={chatContainerStyle}>
        {/* Header bar */}
        <div style={chatHeaderStyle}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Dhyey's AI Assistant</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: 13 }}>Powered by Hugging Face AI</p>
          </div>
        </div>

        {/* Messages */}
        <div style={chatBodyStyle} ref={chatBodyRef}>
          {messages.map((message, index) => (
            <div key={index} style={messageStyle(message.from === 'user')}>
              <div style={bubbleStyle(message.from === 'user')}>{message.text}</div>
            </div>
          ))}

          {loading && (
            <div style={messageStyle(false)}>
              <div style={{ ...bubbleStyle(false), opacity: 0.7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: theme.accent.primary,
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: theme.accent.primary,
                      animation: 'pulse 1.5s ease-in-out infinite 0.2s',
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: theme.accent.primary,
                      animation: 'pulse 1.5s ease-in-out infinite 0.4s',
                    }}
                  />
                  <span style={{ marginLeft: 8, color: theme.text.muted }}>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div style={quickQuestionsContainerStyle}>
              <p
                style={{
                  width: '100%',
                  textAlign: 'center',
                  color: theme.text.muted,
                  marginBottom: 8,
                  fontSize: 14,
                }}
              >
                Quick questions to get started:
              </p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  style={quickQuestionBtnStyle}
                  onClick={() => setInput(question)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = theme.accent.gradient;
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = theme.glass.background;
                    e.currentTarget.style.color = theme.accent.primary;
                    e.currentTarget.style.borderColor = `${theme.accent.primary}40`;
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input area */}
        <div style={chatInputContainerStyle}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask me anything about Dhyey..."
            style={inputStyle}
            disabled={loading}
            onFocus={(e) => (e.target.style.borderColor = theme.accent.primary)}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              ...sendButtonStyle,
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
            onMouseOver={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = theme.accent.glowStrong;
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = theme.accent.glow;
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
