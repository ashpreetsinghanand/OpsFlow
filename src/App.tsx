import { useState, type FormEvent } from 'react';
import { TamboProvider, useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { Settings as SettingsIcon, Send, Zap, Github, CreditCard, Database, CheckSquare, Mail } from 'lucide-react';
import { Settings } from './components/Settings';
import { tamboComponents, tamboToolsList } from './lib/tambo-config';
import './index.css';

function ChatInterface() {
  const { thread } = useTamboThread();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isPending) {
      submit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {thread?.messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '20px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Zap color="white" size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
              Start Your Investigation
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '280px', lineHeight: 1.5 }}>
              Ask about users, payments, issues, or emails. OpsFlow will fetch real data and show you what matters.
            </p>
            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>"List issues for owner/repo"</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>"Check Stripe customer for email@..."</p>
              <p style={{ fontSize: '12px', color: '#9ca3af' }}>"Show recent Linear tickets"</p>
            </div>
          </div>
        )}

        {thread?.messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}
          >
            <div style={{
              maxWidth: '85%',
              borderRadius: '16px',
              padding: '12px 16px',
              background: message.role === 'user' ? '#6366f1' : '#f3f4f6',
              color: message.role === 'user' ? 'white' : '#111827'
            }}>
              {Array.isArray(message.content) ? (
                message.content.map((part, i) => (
                  part.type === 'text' ? <p key={i} style={{ fontSize: '14px', margin: 0 }}>{part.text}</p> : null
                ))
              ) : (
                <p style={{ fontSize: '14px', margin: 0 }}>{String(message.content)}</p>
              )}
            </div>
          </div>
        ))}

        {isPending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#f3f4f6', borderRadius: '16px', padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                <div style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.1s' }} />
                <div style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ padding: '16px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about users, payments, issues..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !value.trim()}
            style={{
              padding: '12px 16px',
              background: '#6366f1',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              opacity: isPending || !value.trim() ? 0.5 : 1
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Canvas() {
  const { thread } = useTamboThread();

  const renderedComponents = thread?.messages
    .filter((m) => m.renderedComponent)
    .map((m) => m.renderedComponent);

  const tools = [
    { icon: <Github size={24} />, color: '#18181b', label: 'GitHub' },
    { icon: <CreditCard size={24} />, color: '#6366f1', label: 'Stripe' },
    { icon: <Database size={24} />, color: '#10b981', label: 'Supabase' },
    { icon: <CheckSquare size={24} />, color: '#8b5cf6', label: 'Linear' },
    { icon: <Mail size={24} />, color: '#18181b', label: 'Resend' },
  ];

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '24px', background: '#fafafa' }}>
      {(!renderedComponents || renderedComponents.length === 0) ? (
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            {tools.map((tool) => (
              <div key={tool.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: tool.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {tool.icon}
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{tool.label}</span>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            Dynamic Canvas
          </h2>
          <p style={{ color: '#6b7280', maxWidth: '400px', lineHeight: 1.5 }}>
            Components will appear here based on your queries. The AI decides which interface to show you.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {renderedComponents.map((component, i) => (
            <div key={i}>{component}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#fafafa' }}>
      {/* Sidebar */}
      <div style={{
        width: '400px',
        minWidth: '400px',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap color="white" size={20} />
            </div>
            <div>
              <h1 style={{ fontWeight: 700, color: '#111827', fontSize: '16px', margin: 0 }}>OpsFlow</h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Universal Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            <SettingsIcon size={20} color="#6b7280" />
          </button>
        </div>

        {/* Chat */}
        <ChatInterface />
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas />
      </div>

      {/* Settings Modal */}
      <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  const tamboApiKey = localStorage.getItem('TAMBO_KEY') || '';

  if (!tamboApiKey) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '40px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Zap color="white" size={36} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
            Welcome to OpsFlow
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', lineHeight: 1.5 }}>
            The Universal Generative Admin Console. Connect all your tools in one place.
          </p>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              Tambo API Key
            </label>
            <input
              type="password"
              placeholder="tam_..."
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '16px',
                boxSizing: 'border-box'
              }}
              onChange={(e) => {
                if (e.target.value.trim()) {
                  localStorage.setItem('TAMBO_KEY', e.target.value.trim());
                }
              }}
            />
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
          </div>
          <p style={{ marginTop: '24px', fontSize: '12px', color: '#9ca3af' }}>
            Get your API key at <a href="https://tambo.co" style={{ color: '#6366f1' }}>tambo.co</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={tamboApiKey}
      components={tamboComponents}
      tools={tamboToolsList}
    >
      <AppContent />
    </TamboProvider>
  );
}
