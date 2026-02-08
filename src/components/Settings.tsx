import { useState, useEffect } from 'react';
import { X, Key, Github, CreditCard, Database, CheckSquare, Mail, Sparkles } from 'lucide-react';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

interface KeyConfig {
    id: string;
    label: string;
    icon: React.ReactNode;
    placeholder: string;
    storageKey: string;
}

const keyConfigs: KeyConfig[] = [
    { id: 'tambo', label: 'Tambo API Key', icon: <Sparkles size={18} />, placeholder: 'tam_...', storageKey: 'TAMBO_KEY' },
    { id: 'github', label: 'GitHub Token', icon: <Github size={18} />, placeholder: 'ghp_...', storageKey: 'GITHUB_TOKEN' },
    { id: 'stripe', label: 'Stripe Secret Key', icon: <CreditCard size={18} />, placeholder: 'sk_...', storageKey: 'STRIPE_KEY' },
    { id: 'supabase', label: 'Supabase Key', icon: <Database size={18} />, placeholder: 'eyJ...', storageKey: 'SUPABASE_KEY' },
    { id: 'linear', label: 'Linear API Key', icon: <CheckSquare size={18} />, placeholder: 'lin_...', storageKey: 'LINEAR_KEY' },
    { id: 'resend', label: 'Resend API Key', icon: <Mail size={18} />, placeholder: 're_...', storageKey: 'RESEND_KEY' },
];

export function Settings({ isOpen, onClose }: SettingsProps) {
    const [keys, setKeys] = useState<Record<string, string>>({});

    useEffect(() => {
        const storedKeys: Record<string, string> = {};
        keyConfigs.forEach(config => {
            storedKeys[config.storageKey] = localStorage.getItem(config.storageKey) || '';
        });
        setKeys(storedKeys);
    }, [isOpen]);

    const handleSave = () => {
        Object.entries(keys).forEach(([key, value]) => {
            if (value.trim()) {
                localStorage.setItem(key, value.trim());
            } else {
                localStorage.removeItem(key);
            }
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                width: '100%',
                maxWidth: '480px',
                margin: '16px',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #f3f4f6'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            padding: '10px',
                            background: '#e0e7ff',
                            borderRadius: '12px'
                        }}>
                            <Key color="#6366f1" size={20} />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>
                            API Integrations
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}
                    >
                        <X size={20} color="#6b7280" />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    padding: '24px',
                    maxHeight: '60vh',
                    overflowY: 'auto'
                }}>
                    {/* Privacy Notice */}
                    <div style={{
                        padding: '14px 16px',
                        background: '#fef3c7',
                        border: '1px solid #fcd34d',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: '#92400e',
                        marginBottom: '20px'
                    }}>
                        <strong>Privacy First:</strong> All keys are stored locally in your browser. They never leave your device.
                    </div>

                    {/* Key Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {keyConfigs.map(config => (
                            <div key={config.id}>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    <span style={{ color: '#6b7280' }}>{config.icon}</span>
                                    {config.label}
                                </label>
                                <input
                                    type="password"
                                    value={keys[config.storageKey] || ''}
                                    onChange={(e) => setKeys(prev => ({ ...prev, [config.storageKey]: e.target.value }))}
                                    placeholder={config.placeholder}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: '10px',
                                        fontSize: '14px',
                                        fontFamily: 'monospace',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.2s'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #f3f4f6',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            color: '#4b5563',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 20px',
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer'
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
