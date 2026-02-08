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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-xl">
                            <Key className="text-indigo-600" size={20} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">API Integrations</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                        <strong>Privacy First:</strong> All keys are stored locally in your browser. They never leave your device.
                    </div>

                    {keyConfigs.map(config => (
                        <div key={config.id} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                {config.icon}
                                {config.label}
                            </label>
                            <input
                                type="password"
                                value={keys[config.storageKey] || ''}
                                onChange={(e) => setKeys(prev => ({ ...prev, [config.storageKey]: e.target.value }))}
                                placeholder={config.placeholder}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono text-sm"
                            />
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
