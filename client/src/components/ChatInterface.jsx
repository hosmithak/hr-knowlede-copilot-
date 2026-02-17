import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { api } from '../services/api';

const suggestions = [
  "What's the leave policy?",
  "How do I apply for remote work?",
  "What are the medical benefits?",
  "Explain the appraisal process",
  "Code of conduct guidelines",
];

const BotAvatar = () => (
  <div style={{
    width: 34, height: 34,
    background: 'linear-gradient(135deg, var(--accent), var(--violet))',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, flexShrink: 0,
    boxShadow: '0 0 16px rgba(56,189,248,0.2)',
  }}>🧠</div>
);

const UserAvatar = () => (
  <div style={{
    width: 34, height: 34,
    background: 'var(--bg-float)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
    fontFamily: 'var(--font-display)', flexShrink: 0,
  }}>You</div>
);

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24,
    animation: 'fadeUp 0.3s ease forwards' }}>
    <BotAvatar />
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: '14px 14px 14px 4px',
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} style={{
            width: 6, height: 6,
            background: 'var(--accent)',
            borderRadius: '50%',
            animation: `bounce 1.2s ${delay}s infinite`,
            opacity: 0.6,
          }} />
        ))}
      </div>
    </div>
  </div>
);

const Message = ({ role, content }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    flexDirection: role === 'user' ? 'row-reverse' : 'row',
    marginBottom: 24,
    animation: 'fadeUp 0.3s ease forwards',
  }}>
    {role === 'user' ? <UserAvatar /> : <BotAvatar />}
    <div style={{
      maxWidth: '72%',
      padding: '14px 18px',
      borderRadius: role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
      fontSize: 14,
      lineHeight: 1.65,
      ...(role === 'user'
        ? {
            background: 'linear-gradient(135deg, #1a5f8a, #1e4a7a)',
            border: '1px solid rgba(56,189,248,0.2)',
            color: '#e0f4ff',
          }
        : {
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }),
    }}>
      <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
    </div>
  </div>
);

const WelcomeState = ({ onSuggestion }) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 0 40px',
    animation: 'fadeUp 0.6s ease forwards',
  }}>
    <div style={{
      width: 72, height: 72,
      background: 'linear-gradient(135deg, var(--accent), var(--violet))',
      borderRadius: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 32,
      margin: '0 auto 20px',
      boxShadow: '0 0 40px rgba(56,189,248,0.25), 0 0 80px rgba(129,140,248,0.1)',
    }}>🧠</div>

    <h1 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 26, fontWeight: 800,
      marginBottom: 8,
      background: 'linear-gradient(135deg, var(--text-primary), var(--accent))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>Ask anything about HR</h1>

    <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 32 }}>
      I have access to all your company policies and HR documents.
    </p>

    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
      maxWidth: 600, margin: '0 auto',
    }}>
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSuggestion(s)}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: 20,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--accent-dim)';
            e.currentTarget.style.borderColor = 'var(--border-glow)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >{s}</button>
      ))}
    </div>
  </div>
);

export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (text) => {
    const question = (text || input).trim();
    if (!question || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const response = await api.askQuestion(question);
      setMessages(prev => [...prev, { role: 'assistant', content: response.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 860, margin: '0 auto', width: '100%' }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 0' }}>
        {messages.length === 0 && <WelcomeState onSuggestion={handleSubmit} />}

        {messages.map((msg, i) => (
          <Message key={i} role={msg.role === 'user' ? 'user' : 'bot'} content={msg.content} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ padding: '20px 32px 24px', background: 'linear-gradient(to top, var(--bg-void) 80%, transparent)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-surface)',
          border: `1px solid ${input.trim() ? 'var(--border-glow)' : 'var(--border)'}`,
          borderRadius: 16,
          padding: '10px 10px 10px 20px',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: input.trim() ? '0 0 0 3px var(--accent-glow)' : 'none',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about leave, benefits, policies…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text-primary)', fontFamily: 'var(--font-body)',
              fontSize: 14, lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading}
            style={{
              width: 38, height: 38,
              background: input.trim() && !isLoading ? 'var(--accent)' : 'var(--bg-raised)',
              border: 'none', borderRadius: 10, cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() && !isLoading ? 'var(--bg-void)' : 'var(--text-muted)',
              transition: 'all 0.2s', flexShrink: 0,
            }}
          >
            {isLoading
              ? <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} />
              : <Send size={16} />
            }
          </button>
        </div>
      </div>
    </div>
  );
}