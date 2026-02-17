import React from 'react';
import { MessageSquare, Upload, Cpu } from 'lucide-react';

export function Layout({ children, currentView, setView }) {
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-void)', overflow: 'hidden' }}>

      {/* ── SIDEBAR ──────────────────────────────── */}
      <aside style={{
        width: 260,
        flexShrink: 0,
        background: 'var(--bg-deep)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Ambient glow top-left */}
        <div style={{
          position: 'absolute', top: -60, left: -60,
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, var(--accent), var(--violet))',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              boxShadow: '0 0 20px rgba(56,189,248,0.3)',
            }}>🧠</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: 15,
              letterSpacing: '-0.3px', color: 'var(--text-primary)',
            }}>
              HR <span style={{ color: 'var(--accent)' }}>Copilot</span>
            </div>
          </div>
        </div>

        {/* Nav Label */}
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
          textTransform: 'uppercase', color: 'var(--text-muted)',
          padding: '20px 24px 8px',
        }}>Navigation</div>

        {/* Nav Items */}
        <nav style={{ padding: '0 12px', flex: 1 }}>
          <NavButton
            icon={<MessageSquare size={16} />}
            label="Ask a Question"
            active={currentView === 'chat'}
            onClick={() => setView('chat')}
          />
          <NavButton
            icon={<Upload size={16} />}
            label="Upload Policy"
            active={currentView === 'admin'}
            onClick={() => setView('admin')}
          />
        </nav>

        {/* Footer status */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <div style={{
              width: 7, height: 7,
              background: 'var(--success)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--success)',
              animation: 'pulse 2s infinite',
            }} />
            Knowledge base active
          </div>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: 64,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(8,11,18,0.8)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
          zIndex: 10,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>
            {currentView === 'chat' ? 'HR Assistant' : 'Upload Policy'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cpu size={13} style={{ color: 'var(--text-muted)' }} />
            <span style={{
              fontSize: 12, color: 'var(--text-muted)',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              padding: '4px 12px', borderRadius: 20,
            }}>
              {currentView === 'chat' ? 'AI-Powered · Policies' : 'Admin · Knowledge Base'}
            </span>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '11px 14px',
        borderRadius: 10, border: active ? '1px solid var(--border-glow)' : '1px solid transparent',
        background: active ? 'var(--accent-dim)' : 'none',
        color: active ? 'var(--accent)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.2s',
        marginBottom: 2, textAlign: 'left',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-raised)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
    >
      <span style={{ opacity: 0.8, width: 20, display: 'flex', alignItems: 'center' }}>{icon}</span>
      {label}
    </button>
  );
}