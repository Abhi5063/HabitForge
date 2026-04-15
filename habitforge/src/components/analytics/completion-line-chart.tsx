'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: { date: string; completions: number; xp: number }[];
}

export function CompletionLineChart({ data }: Props) {
    return (
        <div className="h-[300px] w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative">
            <h3 className="font-heading font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm">Habit Completions Over Time</h3>
            
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                    <XAxis 
                        dataKey="date" 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={10}
                    />
                    <YAxis 
                        stroke="#6b7280" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                    />
                    <Tooltip 
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-4 rounded-xl shadow-xl border-t-2 border-t-[#FFD700]">
                                        <p className="font-mono text-gray-400 text-xs mb-2">{label}</p>
                                        <p className="font-bold text-white text-lg">{payload[0].value} <span className="text-sm font-normal text-gray-400">Completions</span></p>
                                        <p className="font-bold text-[#FFD700] text-sm">+{payload[0].payload.xp} XP</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        cursor={{ stroke: '#2A2A2A', strokeWidth: 2 }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="completions" 
                        stroke="#FF6B00" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#FFD700', strokeWidth: 2, stroke: '#0A0A0A' }}
                        activeDot={{ r: 6, fill: '#FF6B00', stroke: '#FFF', strokeWidth: 2 }}
                        animationDuration={1500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
