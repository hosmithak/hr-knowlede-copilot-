import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { api } from '../services/api';

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fileIconMap = { pdf: '📕', txt: '📄', md: '📝' };

export function AdminUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setMessage('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    try {
      await api.uploadPolicy(file);
      setStatus('success');
      setMessage(`"${file.name}" uploaded successfully!`);
      setFile(null);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to upload policy. Please try again.');
    }
  };

  const ext = file?.name.split('.').pop().toLowerCase();

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', color: 'var(--accent)',
            marginBottom: 8,
          }}>Admin · Knowledge Base</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 28,
            fontWeight: 800, marginBottom: 6,
          }}>Upload Policy Document</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Add new HR policies to the knowledge base. Changes take effect immediately.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          onClick={() => !file && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            background: isDragging ? 'var(--bg-raised)' : 'var(--bg-surface)',
            border: `2px dashed ${isDragging || file ? 'var(--border-glow)' : 'var(--border)'}`,
            borderStyle: file ? 'solid' : 'dashed',
            borderRadius: 20,
            padding: '48px 32px',
            textAlign: 'center',
            cursor: file ? 'default' : 'pointer',
            transition: 'all 0.25s',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 50%, var(--accent-glow), transparent 70%)',
            opacity: isDragging ? 1 : 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 60, height: 60,
            background: 'var(--accent-dim)',
            border: '1px solid var(--border-glow)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, margin: '0 auto 16px',
            transition: 'transform 0.2s',
            transform: isDragging ? 'scale(1.08) translateY(-3px)' : 'scale(1)',
          }}>
            <UploadCloud size={28} color="var(--accent)" />
          </div>

          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {isDragging ? 'Drop to upload' : 'Drop your document here'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            or{' '}
            <span style={{ color: 'var(--accent)', cursor: 'pointer' }} onClick={() => inputRef.current?.click()}>
              browse to upload
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
            {['.pdf', '.txt', '.md'].map(f => (
              <span key={f} style={{
                fontSize: 11, padding: '3px 10px',
                background: 'var(--bg-raised)', border: '1px solid var(--border)',
                borderRadius: 20, color: 'var(--text-muted)',
                fontFamily: 'Courier New, monospace', letterSpacing: '0.5px',
              }}>{f}</span>
            ))}
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.md"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files?.[0])}
        />

        {/* File Info */}
        {file && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-glow)',
            borderRadius: 12, padding: '12px 16px',
            marginTop: 16,
            animation: 'fadeUp 0.3s ease',
          }}>
            <span style={{ fontSize: 22 }}>{fileIconMap[ext] || '📄'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {file.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatBytes(file.size)}</div>
            </div>
            <button
              onClick={() => { setFile(null); setStatus('idle'); setMessage(''); if (inputRef.current) inputRef.current.value = ''; }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 6,
                display: 'flex', alignItems: 'center', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none'; }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleUpload}
            disabled={!file || status === 'uploading'}
            style={{
              width: '100%', padding: 15,
              background: file && status !== 'uploading'
                ? 'linear-gradient(135deg, var(--accent), #60c7f9)'
                : 'var(--bg-float)',
              border: 'none', borderRadius: 14,
              color: file && status !== 'uploading' ? 'var(--bg-void)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700,
              cursor: file && status !== 'uploading' ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'all 0.25s',
              boxShadow: file && status !== 'uploading' ? '0 4px 24px rgba(56,189,248,0.2)' : 'none',
              letterSpacing: '0.3px',
            }}
            onMouseEnter={e => { if (file && status !== 'uploading') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,189,248,0.3)'; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = file ? '0 4px 24px rgba(56,189,248,0.2)' : 'none'; }}
          >
            {status === 'uploading' ? (
              <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Uploading…</>
            ) : file ? (
              <><UploadCloud size={16} /> Upload "{file.name}"</>
            ) : (
              'Select a file to upload'
            )}
          </button>
        </div>

        {/* Toast */}
        {status === 'success' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 18px', borderRadius: 12, marginTop: 16,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
            color: 'var(--success)', fontSize: 13, fontWeight: 500,
            animation: 'fadeUp 0.3s ease',
          }}>
            <CheckCircle size={16} />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 18px', borderRadius: 12, marginTop: 16,
            background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
            color: 'var(--danger)', fontSize: 13, fontWeight: 500,
            animation: 'fadeUp 0.3s ease',
          }}>
            <AlertCircle size={16} />
            {message}
          </div>
        )}
      </div>
    </div>
  );
}