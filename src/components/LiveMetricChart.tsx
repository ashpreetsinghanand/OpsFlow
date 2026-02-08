import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type ChartType = 'line' | 'bar' | 'area';

interface DataPoint {
    name: string;
    value: number;
}

interface LiveMetricChartProps {
    data: DataPoint[];
    chartType?: ChartType;
    color?: string;
    title: string;
    unit?: string;
}

export function LiveMetricChart({
    data,
    chartType = 'line',
    color = '#6366f1',
    title,
    unit = ''
}: LiveMetricChartProps) {
    const formatValue = (value: number | undefined) => {
        if (value === undefined) return ['', title];
        return [`${value}${unit}`, title];
    };

    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 10, right: 10, left: -20, bottom: 0 },
        };

        const tooltipStyle = {
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        };

        switch (chartType) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip contentStyle={tooltipStyle} formatter={formatValue} />
                        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip contentStyle={tooltipStyle} formatter={formatValue} />
                        <Area type="monotone" dataKey="value" stroke={color} fill={`${color}20`} strokeWidth={2} />
                    </AreaChart>
                );
            default:
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <Tooltip contentStyle={tooltipStyle} formatter={formatValue} />
                        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ fill: color, strokeWidth: 0 }} />
                    </LineChart>
                );
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">{title}</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
