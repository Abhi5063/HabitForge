'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    data: { name: string; completionRate: number; color: string }[];
}

export function HabitBreakdownChart({ data }: Props) {
    return (
        <div className="h-[300px] w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm">Habit Completion Rates</h3>
            
            <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={data} margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                        dataKey="name" 
                        type="category" 
                        axisLine={false} 
                        tickLine={false} 
                        stroke="#FFF" 
                        fontSize={12} 
                        fontWeight="bold"
                        width={100}
                    />
                    <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 rounded shadow-xl">
                                        <div className="font-bold" style={{ color: payload[0].payload.color }}>
                                            {payload[0].payload.name}: {payload[0].value}%
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar 
                        dataKey="completionRate" 
                        radius={4} 
                        barSize={20}
                        animationDuration={1500}
                        label={{ position: 'right', fill: '#FFF', fontSize: 12, formatter: (val: any) => `${val}%` }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
