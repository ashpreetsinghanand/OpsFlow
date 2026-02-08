import { Github, CreditCard, Database, Mail, CheckSquare, Circle } from 'lucide-react';

type SourceType = 'github' | 'stripe' | 'supabase' | 'resend' | 'linear';
type EventType = 'info' | 'success' | 'error' | 'warning';

interface TimelineEvent {
    id: string;
    source: SourceType;
    timestamp: string;
    description: string;
    type: EventType;
}

interface UnifiedTimelineProps {
    events: TimelineEvent[];
    title?: string;
}

const sourceIcons: Record<SourceType, React.ReactNode> = {
    github: <Github size={14} />,
    stripe: <CreditCard size={14} />,
    supabase: <Database size={14} />,
    resend: <Mail size={14} />,
    linear: <CheckSquare size={14} />,
};

const typeColors: Record<EventType, string> = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
};

export function UnifiedTimeline({ events, title = 'Activity Timeline' }: UnifiedTimelineProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{title}</h3>

            <div className="space-y-0">
                {events.map((event, index) => (
                    <div key={event.id} className="relative flex gap-4 pb-5 last:pb-0">
                        {/* Timeline line */}
                        {index !== events.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gray-200" />
                        )}

                        {/* Dot */}
                        <div className={`relative z-10 w-6 h-6 rounded-full ${typeColors[event.type]} flex items-center justify-center flex-shrink-0`}>
                            <Circle size={8} className="text-white fill-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                <span className="flex items-center gap-1 capitalize">
                                    {sourceIcons[event.source]}
                                    {event.source}
                                </span>
                                <span>•</span>
                                <span>{event.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-900">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
