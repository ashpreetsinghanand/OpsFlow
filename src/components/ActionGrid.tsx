import type { MouseEventHandler } from 'react';
import { AlertTriangle, Zap, RotateCcw, Send, Trash2, RefreshCw, Plus, CheckCircle } from 'lucide-react';

type Intent = 'primary' | 'success' | 'warning' | 'danger' | 'default';

interface Action {
    id: string;
    label: string;
    intent: Intent;
    icon?: string;
    isLoading?: boolean;
}

interface ActionGridProps {
    actions: Action[];
    onAction: (actionId: string) => void;
}

const intentConfig: Record<Intent, { bg: string; hover: string; text: string }> = {
    primary: { bg: 'bg-indigo-600', hover: 'hover:bg-indigo-700', text: 'text-white' },
    success: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', text: 'text-white' },
    warning: { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', text: 'text-white' },
    danger: { bg: 'bg-red-600', hover: 'hover:bg-red-700', text: 'text-white' },
    default: { bg: 'bg-gray-100', hover: 'hover:bg-gray-200', text: 'text-gray-800' },
};

const iconMap: Record<string, React.ReactNode> = {
    zap: <Zap size={16} />,
    refresh: <RefreshCw size={16} />,
    rollback: <RotateCcw size={16} />,
    send: <Send size={16} />,
    delete: <Trash2 size={16} />,
    add: <Plus size={16} />,
    check: <CheckCircle size={16} />,
    warning: <AlertTriangle size={16} />,
};

export function ActionGrid({ actions, onAction }: ActionGridProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Available Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map(action => {
                    const config = intentConfig[action.intent];
                    const handleClick: MouseEventHandler = () => onAction(action.id);

                    return (
                        <button
                            key={action.id}
                            onClick={handleClick}
                            disabled={action.isLoading}
                            className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium
                ${config.bg} ${config.hover} ${config.text}
                transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              `}
                        >
                            {action.isLoading ? (
                                <RefreshCw size={16} className="animate-spin" />
                            ) : (
                                action.icon && iconMap[action.icon]
                            )}
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
