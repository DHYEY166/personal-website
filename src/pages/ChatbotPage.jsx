import React, { useState, useRef, useEffect } from 'react';
import { buildHuggingFaceInputs, getFallbackResponse } from '../data/qaContext';
import { useTheme } from '../styles/useTheme';
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
    // width: 100% because auto margins stop the app's flex column from stretching this.
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    padding: '100px 24px 40px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    marginBottom: 20,
  };

  const chatContainerStyle = {
    background: theme.bg.surface,
    border: theme.border.default,
    borderRadius: theme.radius.lg,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  };

  const chatHeaderStyle = {
    background: theme.bg.surface,
    borderBottom: theme.border.default,
    padding: '14px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const chatBodyStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    background: theme.bg.page,
  };

  // Footer = quick-question chips + input row. It sits below the scrolling log (not inside or
  // over it), so the chips never cover messages.
  const chatFooterStyle = {
    background: theme.bg.surface,
    borderTop: theme.border.default,
    padding: '12px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  };

  const chatInputContainerStyle = {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  };

  const messageStyle = (isUser) => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    marginBottom: 4,
  });

  // User: solid accent. Assistant: light surface with a hairline border. No shadows.
  const bubbleStyle = (isUser) => ({
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: isUser ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
    background: isUser ? theme.accent.primary : theme.bg.surface,
    border: isUser ? `1px solid ${theme.accent.primary}` : theme.border.default,
    color: isUser ? theme.text.onAccent : theme.text.primary,
    fontSize: 15,
    lineHeight: 1.6,
    whiteSpace: isUser ? 'pre-line' : 'normal',
    overflowWrap: 'anywhere',
  });

  const inputStyle = {
    flex: 1,
    // Inputs have an intrinsic min width; without this the row overflows narrow phones and
    // pushes the Send button past the card edge.
    minWidth: 0,
    padding: '11px 14px',
    fontSize: 15,
  };

  /* ---- render ---- */
  /* ---- render ---- */

  return (
    <main id="main" style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', marginBottom: 6 }}>
          Ask Dhyey AI
        </h1>
        <p style={{ fontSize: 17, color: theme.text.secondary }}>
          Get instant answers about Dhyey's background, skills, and experience
        </p>
      </div>

      <div style={chatContainerStyle}>
        {/* Header bar */}
        <div style={chatHeaderStyle}>
          <span
            aria-hidden="true"
            style={{ width: 8, height: 8, borderRadius: '50%', background: theme.accent.primary, flexShrink: 0 }}
          />
          <h2 style={{ margin: 0, fontSize: 18 }}>Chat with AI</h2>
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
              <div style={bubbleStyle(false)}>
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
          <div className="quick-chips" role="group" aria-label="Quick questions">
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
              className="field"
              style={inputStyle}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="btn btn--primary"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
