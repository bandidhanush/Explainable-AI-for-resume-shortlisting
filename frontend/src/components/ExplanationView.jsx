import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ExplanationView = ({ explanation }) => {
    if (!explanation || explanation.length === 0) return null;

    const data = explanation.map(([name, value]) => ({
        name,
        value: Math.abs(value),
        originalValue: value,
        isPositive: value > 0
    })).sort((a, b) => b.value - a.value);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-surface-highlight border border-white/10 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                    <p className="text-heading font-semibold text-sm mb-1">{data.name}</p>
                    <div className="flex items-center gap-2">
                        {data.isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                        ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-primary" />
                        )}
                        <span className={`text-sm font-medium ${data.isPositive ? 'text-secondary' : 'text-primary'}`}>
                            {data.isPositive ? '+' : ''}{data.originalValue.toFixed(4)}
                        </span>
                    </div>
                    <p className="text-xs text-body mt-1">
                        {data.isPositive ? 'Positive impact' : 'Negative impact'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Chart */}
            <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                            stroke="rgba(255,255,255,0.03)"
                        />
                        <XAxis
                            type="number"
                            stroke="#64748b"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            tickLine={{ stroke: '#334155' }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={110}
                            stroke="#64748b"
                            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
                            tickLine={{ stroke: '#334155' }}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isPositive ? '#10b981' : '#6366f1'}
                                    style={{
                                        filter: `drop-shadow(0 0 8px ${entry.isPositive ? '#10b98140' : '#6366f140'})`,
                                        opacity: 0.9
                                    }}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-secondary shadow-glow-secondary" />
                    <div className="text-left">
                        <p className="text-xs font-medium text-heading">Positive Contribution</p>
                        <p className="text-xs text-body/60">Increases match score</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded bg-primary shadow-glow-primary" />
                    <div className="text-left">
                        <p className="text-xs font-medium text-heading">Negative Contribution</p>
                        <p className="text-xs text-body/60">Decreases match score</p>
                    </div>
                </div>
            </div>

            {/* Top Features Summary */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-semibold text-heading">Top Strengths</span>
                    </div>
                    <div className="space-y-2">
                        {data.filter(d => d.isPositive).slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-body font-medium">{item.name}</span>
                                <span className="text-secondary font-mono">+{item.originalValue.toFixed(3)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingDown className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-heading">Areas for Improvement</span>
                    </div>
                    <div className="space-y-2">
                        {data.filter(d => !d.isPositive).slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs">
                                <span className="text-body font-medium">{item.name}</span>
                                <span className="text-primary font-mono">{item.originalValue.toFixed(3)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExplanationView;
