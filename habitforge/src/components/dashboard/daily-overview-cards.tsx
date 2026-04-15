'use client';

import { CheckCircle2, Zap, Flame, Trophy } from 'lucide-react';
import { useCountUp } from '@/hooks/use-count-up';

interface Props {
  habitsTotal: number;
  habitsCompleted: number;
  xpToday: number;
  bestStreak: number;
  level: number;
}

export function DailyOverviewCards({ habitsTotal, habitsCompleted, xpToday, bestStreak, level }: Props) {
  const animatedCompleted = useCountUp(habitsCompleted, 1000);
  const animatedXP = useCountUp(xpToday, 1500);
  const animatedStreak = useCountUp(bestStreak, 1200);

  const completionPercent = habitsTotal === 0 ? 0 : (animatedCompleted / habitsTotal) * 100;
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Habits Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#FF6B00] transition-colors group relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-[#FF6B00]" />
         </div>
         <p className="text-sm text-gray-400 font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#FF6B00]" /> Today's Habits</p>
         <div className="flex items-end gap-3">
             <div className="text-4xl font-display text-white">{animatedCompleted}</div>
             <div className="text-gray-500 font-mono text-sm mb-1">/ {habitsTotal}</div>
         </div>
         {/* Simple Progress Ring simulation */}
         <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full mt-4 overflow-hidden">
             <div className="h-full bg-[#FF6B00] transition-all duration-500" style={{ width: `${completionPercent}%` }} />
         </div>
      </div>

      {/* XP Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#FFD700] transition-colors group relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-16 h-16 text-[#FFD700]" />
         </div>
         <p className="text-sm text-gray-400 font-semibold mb-2 flex items-center gap-2"><Zap className="w-4 h-4 text-[#FFD700]" /> Daily XP</p>
         <div className="flex items-end gap-2">
             <div className="text-4xl font-display text-white">+{animatedXP}</div>
             <div className="text-[#FFD700] font-bold text-sm mb-1">XP</div>
         </div>
      </div>

      {/* Streak Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-red-500 transition-colors group relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-red-500" />
         </div>
         <p className="text-sm text-gray-400 font-semibold mb-2 flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> Best Streak</p>
         <div className="flex items-end gap-2">
             <div className="text-4xl font-display text-white">{animatedStreak}</div>
             <div className="text-red-500 font-bold text-sm mb-1">Days</div>
         </div>
      </div>

      {/* Level Card */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-5 hover:border-[#22C55E] transition-colors group relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-16 h-16 text-[#22C55E]" />
         </div>
         <p className="text-sm text-gray-400 font-semibold mb-2 flex items-center gap-2"><Trophy className="w-4 h-4 text-[#22C55E]" /> Current Level</p>
         <div className="flex items-end gap-2">
             <div className="text-4xl font-display text-white">{level}</div>
             <div className="text-[#22C55E] font-bold text-sm mb-1">Rank</div>
         </div>
      </div>
    </div>
  );
}
