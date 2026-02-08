import { Github, CreditCard, Database, Mail, CheckSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type SourceType = 'github' | 'stripe' | 'supabase' | 'resend' | 'linear';
type StatusType = 'success' | 'error' | 'warning' | 'pending';

interface DataPoint {
    label: string;
    value: string;
}

interface UniversalCardProps {
    source: SourceType;
    title: string;
    subtitle?: string;
    status?: StatusType;
    dataPoints: DataPoint[];
}

const sourceConfig: Record<SourceType, { icon: React.ReactNode; color: string; bgColor: string }> = {
    github: { icon: <Github size={18} />, color: 'text-gray-900', bgColor: 'bg-gray-900' },
    stripe: { icon: <CreditCard size={18} />, color: 'text-indigo-600', bgColor: 'bg-indigo-600' },
    supabase: { icon: <Database size={18} />, color: 'text-emerald-600', bgColor: 'bg-emerald-600' },
    resend: { icon: <Mail size={18} />, color: 'text-black', bgColor: 'bg-black' },
    linear: { icon: <CheckSquare size={18} />, color: 'text-violet-600', bgColor: 'bg-violet-600' },
};

const statusConfig: Record<StatusType, { icon: React.ReactNode; color: string; bgColor: string }> = {
    success: { icon: <CheckCircle size={14} />, color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
    error: { icon: <AlertCircle size={14} />, color: 'text-red-700', bgColor: 'bg-red-100' },
    warning: { icon: <AlertCircle size={14} />, color: 'text-amber-700', bgColor: 'bg-amber-100' },
    pending: { icon: <Clock size={14} />, color: 'text-blue-700', bgColor: 'bg-blue-100' },
};

export function UniversalCard({ source, title, subtitle, status, dataPoints }: UniversalCardProps) {
    const config = sourceConfig[source];
    const statusCfg = status ? statusConfig[status] : null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className={`${config.bgColor} px-5 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2 text-white">
                    {config.icon}
                    <span className="font-medium capitalize">{source}</span>
                </div>
                {statusCfg && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusCfg.bgColor} ${statusCfg.color}`}>
                        {statusCfg.icon}
                        <span className="capitalize">{status}</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}

                <div className="mt-4 space-y-2">
                    {dataPoints.map((dp, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-500">{dp.label}</span>
                            <span className="text-sm font-medium text-gray-900 font-mono">{dp.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
