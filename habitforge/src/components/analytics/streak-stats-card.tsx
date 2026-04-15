'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    streaks: { name: string; currentStreak: number }[];
    bestStreakEver: number;
}

export function StreakStatsCard({ streaks, bestStreakEver }: Props) {
    const maxLocalStreak = Math.max(...streaks.map(s => s.currentStreak), 1); // Avoid div by 0

    const getFlameColor = (streak: number) => {
        if (streak < 7) return 'text-gray-400';
        if (streak < 30) return 'text-[#FF6B00]';
        return 'text-[#FFD700]';
    };

    return (
        <div className="h-[300px] w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col">
            <h3 className="font-heading font-bold text-gray-400 mb-4 uppercase tracking-wider text-sm">Active Streaks</h3>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {streaks.map((streak, idx) => {
                    const widthPct = Math.max(5, (streak.currentStreak / maxLocalStreak) * 100);
                    return (
                        <div key={idx} className="space-y-1 group">
                            <div className="flex justify-between text-xs font-bold text-white mb-1">
                                <span className="truncate pr-4">{streak.name}</span>
                                <span className={getFlameColor(streak.currentStreak)}>{streak.currentStreak} 🔥</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#0A0A0A] rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${widthPct}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${streak.currentStreak >= 30 ? 'from-[#FF6B00] to-[#FFD700]' : 'from-[#2A2A2A] to-[#FF6B00]'}`} 
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex justify-between items-center text-sm">
                <span className="text-gray-400 font-mono">Best ever streak</span>
                <span className="font-bold text-2xl text-[#FFD700]">{bestStreakEver} <span className="text-sm">days</span></span>
            </div>
        </div>
    );
}
