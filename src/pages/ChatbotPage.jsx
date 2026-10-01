import React, { useState, useRef, useEffect } from 'react';
import { buildHuggingFaceInputs, getFallbackResponse } from '../data/qaContext';
import { useTheme } from '../context/ThemeContext';
import { gradientText } from '../styles/theme';
import { usePageMeta } from '../hooks/usePageMeta';
import ChatMarkdown from '../components/ui/ChatMarkdown';
import { quickQuestions } from '../data/quickQuestions';

/** Same-origin proxy on Vercel (`/api/hf-chat`) — HF Inference API blocks browser CORS */
const HF_CHAT_PATH = '/api/hf-chat';

/** Friendly text for HTTP 429 from /api/hf-chat (visitor limit or the upstream model's limit). */
function rateLimitMessage(body, retryAfterHeader) {
  const seconds = Number(body?.retryAfter ?? retryAfterHeader) || 60;
  const wait =
    seconds < 90
      ? 'in a minute'
      : seconds < 3600
        ? `in about ${Math.ceil(seconds / 60)} minutes`
        : 'tomorrow';
  if (body?.code === 'upstream_rate_limited') {
    return `The AI service is getting a lot of questions right now. Please try again ${wait}. In the meantime, everything is also on the [home page](/#about).`;
  }
  return `You've asked a lot of questions, thank you for the interest! Please try again ${wait}. You can also reach Dhyey directly via the [contact form](/#contact).`;
}

export default function ChatbotPage() {
  const { theme } = useTheme();
  usePageMeta({ title: 'Ask Dhyey AI | Dhyey Desai', path: '/chatbot' });
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

  /** Sends the typed input, or `preset` (a quick-question chip) without touching the draft. */
  const handleSend = async (preset) => {
    const fromChip = typeof preset === 'string';
    const userInput = fromChip ? preset : input;
    if (!userInput.trim() || loading) return;
    setMessages((prev) => [...prev, { from: 'user', text: userInput }]);
    if (!fromChip) setInput('');
    setLoading(true);

    try {
      const inputs = buildHuggingFaceInputs(userInput);
      const res = await fetch(HF_CHAT_PATH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.35,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      if (res.status === 429) {
        let body = null;
        try {
          body = await res.json();
        } catch {
          body = null;
        }
        setMessages((msgs) => [
          ...msgs,
          { from: 'bot', text: rateLimitMessage(body, res.headers.get('Retry-After')) },
        ]);
        return;
      }

      if (!res.ok) {
        const errBody = await res.text();
        let detail = '';
        try {
          const j = JSON.parse(errBody);
          const rawErr = j?.error ?? j?.message;
          detail =
            typeof rawErr === 'string'
              ? rawErr
              : rawErr != null
                ? JSON.stringify(rawErr)
                : errBody?.slice(0, 400);
        } catch {
          detail = errBody?.slice(0, 400);
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

  // Footer = quick-question chips + input row. It sits below the scrolling log (not inside or
  // over it), so the chips never cover messages.
  const chatFooterStyle = {
    background: theme.glass.background,
    backdropFilter: theme.glass.blur,
    WebkitBackdropFilter: theme.glass.blur,
    borderTop: theme.glass.border,
    padding: '12px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const chatInputContainerStyle = {
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
    whiteSpace: isUser ? 'pre-line' : 'normal',
    overflowWrap: 'anywhere',
  });

  const inputStyle = {
    flex: 1,
    // Inputs have an intrinsic min width; without this the row overflows narrow phones and
    // pushes the Send button past the card edge.
    minWidth: 0,
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

  // Chip colours come from the theme through CSS variables; layout, hover, focus, disabled, and
  // the mobile single-line scroller live in index.css (.quick-chips / .quick-chip).
  const quickChipVars = {
    '--chip-bg': theme.glass.background,
    '--chip-border': `${theme.accent.primary}40`,
    '--chip-color': theme.accent.text,
    '--chip-hover-bg': theme.accent.gradient,
    '--chip-focus': theme.accent.text,
  };

  /* ---- render ---- */

  return (
    <main id="main" style={containerStyle}>
      <div style={headerStyle}>
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            ...gradientText(theme.accent.textGradient),
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
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Chat with AI</h2>
        </div>

        {/* Messages */}
        <div
          style={chatBodyStyle}
          ref={chatBodyRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation with Dhyey's AI assistant"
        >
          {messages.map((message, index) => (
            <div key={index} style={messageStyle(message.from === 'user')}>
              <div style={bubbleStyle(message.from === 'user')}>
                {message.from === 'user' ? message.text : <ChatMarkdown text={message.text} />}
              </div>
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
        </div>

        <div style={chatFooterStyle}>
          {/* Quick questions: always available; disabled while a reply is loading. */}
          <div className="quick-chips" role="group" aria-label="Quick questions" style={quickChipVars}>
            {quickQuestions.map((question) => (
              <button
                key={question}
                type="button"
                className="quick-chip"
                disabled={loading}
                onClick={() => handleSend(question)}
              >
                {question}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div style={chatInputContainerStyle}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
              placeholder="Ask me anything about Dhyey..."
              aria-label="Ask a question about Dhyey"
              maxLength={500}
              style={inputStyle}
              disabled={loading}
              onFocus={(e) => (e.target.style.borderColor = theme.accent.primary)}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            <button
              type="button"
              onClick={() => handleSend()}
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
    </main>
  );
}
