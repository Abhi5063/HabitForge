'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface XPLevelProgressProps {
  level: number;
  progressPercent: number;
  xpToNextLevel: number;
}

export function XPLevelProgress({ level, progressPercent, xpToNextLevel }: XPLevelProgressProps) {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B00] opacity-10 blur-3xl" />
        
        <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
                <h3 className="text-gray-400 font-semibold text-sm mb-1 uppercase tracking-wider">Level Progress</h3>
                <div className="font-heading font-bold flex items-baseline gap-2">
                    <span className="text-3xl text-white">Level {level}</span>
                    <span className="text-gray-500 font-mono text-sm">→ Level {level + 1}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-[#FFD700] text-sm font-mono flex items-center gap-1">
                    <Target className="w-3 h-3" /> {xpToNextLevel} XP to level up
                </div>
            </div>
        </div>

        <div className="h-3 w-full bg-[#1A1A1A] rounded-full overflow-hidden relative z-10 border border-[#2A2A2A]">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#FF6B00] to-[#FFD700] rounded-full relative"
            >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[100%] animate-[shimmer_2s_infinite]" />
            </motion.div>
        </div>
    </div>
  );
}
