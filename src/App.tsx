import { useState, FormEvent } from 'react';
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
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread?.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Investigation</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Ask about users, payments, issues, or emails. OpsFlow will fetch real data and show you what matters.
            </p>
            <div className="mt-6 space-y-2 text-xs text-gray-400">
              <p>"List issues for owner/repo"</p>
              <p>"Check Stripe customer for email@..."</p>
              <p>"Show recent Linear tickets"</p>
            </div>
          </div>
        )}

        {thread?.messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
              }`}>
              {Array.isArray(message.content) ? (
                message.content.map((part, i) => (
                  part.type === 'text' ? <p key={i} className="text-sm">{part.text}</p> : null
                ))
              ) : (
                <p className="text-sm">{String(message.content)}</p>
              )}
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about users, payments, issues..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending || !value.trim()}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

  // Collect rendered components from messages
  const renderedComponents = thread?.messages
    .filter((m) => m.renderedComponent)
    .map((m) => m.renderedComponent);

  return (
    <div className="h-full overflow-y-auto p-6">
      {(!renderedComponents || renderedComponents.length === 0) ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { icon: <Github size={24} />, color: 'bg-gray-900', label: 'GitHub' },
              { icon: <CreditCard size={24} />, color: 'bg-indigo-600', label: 'Stripe' },
              { icon: <Database size={24} />, color: 'bg-emerald-600', label: 'Supabase' },
              { icon: <CheckSquare size={24} />, color: 'bg-violet-600', label: 'Linear' },
              { icon: <Mail size={24} />, color: 'bg-black', label: 'Resend' },
            ].map((tool) => (
              <div key={tool.label} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {tool.icon}
                </div>
                <span className="text-xs text-gray-500">{tool.label}</span>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dynamic Canvas</h2>
          <p className="text-gray-500 max-w-md">
            Components will appear here based on your queries. The AI decides which interface to show you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">OpsFlow</h1>
              <p className="text-xs text-gray-500">Universal Admin Console</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <SettingsIcon size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Chat */}
        <ChatInterface />
      </div>

      {/* Main Canvas */}
      <div className="flex-1">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OpsFlow</h1>
          <p className="text-gray-500 mb-6">
            The Universal Generative Admin Console. Connect all your tools in one place.
          </p>
          <div className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tambo API Key</label>
              <input
                type="password"
                placeholder="tam_..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => {
                  if (e.target.value.trim()) {
                    localStorage.setItem('TAMBO_KEY', e.target.value.trim());
                  }
                }}
              />
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            Get your API key at <a href="https://tambo.co" className="text-indigo-600 hover:underline">tambo.co</a>
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
