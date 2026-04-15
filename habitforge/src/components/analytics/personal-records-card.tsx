'use client';

import { Zap, Flame, CheckCircle2, TrendingUp } from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';

interface Props {
    mostXpDay: number;
    longestStreak: number;
    totalHabits: number;
    totalDaysActive: number;
}

export function PersonalRecordsCard({ mostXpDay, longestStreak, totalHabits, totalDaysActive }: Props) {
    return (
        <div className="h-[300px] w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="font-heading font-bold text-gray-400 mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Personal Records
            </h3>
            
            <div className="grid grid-cols-2 gap-4 flex-1 mt-2">
                <RecordItem 
                    icon={<Zap className="w-5 h-5 text-[#FFD700]" />}
                    label="Most XP in a Day"
                    value={mostXpDay}
                    suffix="XP"
                    color="text-[#FFD700]"
                />
                <RecordItem 
                    icon={<Flame className="w-5 h-5 text-red-500" />}
                    label="Longest Streak"
                    value={longestStreak}
                    suffix="Days"
                    color="text-red-500"
                />
                <RecordItem 
                    icon={<CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
                    label="Total Forged"
                    value={totalHabits}
                    suffix="Habits"
                    color="text-[#22C55E]"
                />
                <RecordItem 
                    icon={<TrendingUp className="w-5 h-5 text-gray-300" />}
                    label="Days Active"
                    value={totalDaysActive}
                    suffix="Days"
                    color="text-gray-300"
                />
            </div>
        </div>
    );
}

function RecordItem({ icon, label, value, suffix, color }: { icon: any, label: string, value: number, suffix: string, color: string }) {
    const displayValue = useCountUp(value, 1500);
    return (
        <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity">
                {icon}
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
            <div className={`font-display text-3xl ${color}`}>
                {displayValue} <span className="text-sm font-mono font-normal opacity-50">{suffix}</span>
            </div>
        </div>
    );
}
