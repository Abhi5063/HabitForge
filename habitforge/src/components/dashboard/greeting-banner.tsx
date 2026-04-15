'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface GreetingBannerProps {
  displayName: string;
  hasActiveStreak: boolean;
  level: number;
}

export function GreetingBanner({ displayName, hasActiveStreak, level }: GreetingBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
  }).toUpperCase().replace(',', ' ·');

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 shadow-lg">
        <div>
            <div className="text-xs text-gray-500 font-mono mb-1">{formattedDate}</div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
                {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B00]">{displayName}</span>
                {hasActiveStreak && (
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                        <Flame className="w-8 h-8 text-[#FF6B00] fill-current" />
                    </motion.div>
                )}
            </h1>
        </div>

        <div className="flex items-center gap-3 bg-[#1A1A1A] p-2 pr-4 rounded-full border border-[#2A2A2A]">
            <div className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center font-display text-2xl text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                {level}
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Current Level</span>
                <span className="text-sm font-bold text-[#FFD700]">War Room Active</span>
            </div>
        </div>
    </div>
  );
}
