'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: { date: string; habitXP: number; pathXP: number }[];
}

export function XPBarChart({ data }: Props) {
    return (
        <div className="h-[300px] w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="font-heading font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm">XP History Breakdown</h3>
            
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
                        cursor={{ fill: '#1A1A1A' }}
                        content={({ active, payload, label }) => {
                            if (active && payload && payload.length >= 2) {
                                const total = payload[0].value as number + (payload[1].value as number);
                                return (
                                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] p-4 rounded-xl shadow-xl min-w-[150px]">
                                        <p className="font-mono text-gray-400 text-xs mb-3">{label}</p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF6B00]"/> Habits</span>
                                                <span className="font-bold">{payload[0].value}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FFD700]"/> Paths</span>
                                                <span className="font-bold">{payload[1].value}</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-[#2A2A2A] mt-3 pt-2 text-right">
                                            <span className="font-bold text-white text-lg">+{total} XP</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="habitXP" stackId="a" fill="#FF6B00" radius={[0, 0, 4, 4]} animationDuration={1000} />
                    <Bar 
                        dataKey="pathXP" 
                        stackId="a" 
                        fill="#FFD700" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1000}
                        label={{ position: 'top', fill: '#9ca3af', fontSize: 10, formatter: (val: any) => val === 0 ? '' : '' }} 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
