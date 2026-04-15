'use client';

import { Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';

export function StreakDisplay({ streak }: { streak: number }) {
  const getFlameStyles = () => {
      if (streak === 0) return { color: 'text-gray-600', scale: 0.9, animation: 'none' };
      if (streak < 7) return { color: 'text-gray-400', scale: 1, animation: 'none' };
      if (streak < 30) return { color: 'text-[#FF6B00]', scale: 1.1, animation: 'pulse 2s infinite' };
      if (streak < 100) return { color: 'text-[#FFD700]', scale: 1.25, animation: 'bounce 1s infinite' };
      // Rainbow gradient fallback for 100+
      return { color: 'text-transparent', scale: 1.4, animation: 'pulse 1s infinite' };
  };

  const getMessage = () => {
      if (streak === 0) return "No streak yet. Start today!";
      if (streak < 7) return `${7 - streak} days until 1.5x Multiplier`;
      if (streak < 30) return "1.5x Multiplier Active! 🔥";
      if (streak < 100) return "2.0x Multiplier Active! ⚡";
      return "MAX MULTIPLIER ACTIVE! 👑";
  };

  const styles = getFlameStyles();

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>
          <div className="flex items-center gap-1 cursor-help group">
              <div 
                 className={`transform-gpu transition-all duration-300 ${styles.color} ${streak >= 100 ? 'bg-clip-text bg-gradient-to-tr from-pink-500 via-red-500 to-[#FFD700]' : ''}`}
                 style={{ animation: styles.animation, transform: `scale(${styles.scale})` }}
              >
                  {streak >= 100 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#rainbow-grad)" stroke="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                              <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#ff0000" />
                                  <stop offset="50%" stopColor="#ffff00" />
                                  <stop offset="100%" stopColor="#00ff00" />
                              </linearGradient>
                          </defs>
                          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 2.4 5.6a6.5 6.5 0 11-10.4-3.5" />
                      </svg>
                  ) : (
                    <Flame className="w-5 h-5 fill-current" />
                  )}
              </div>
              <span className={`font-mono font-bold text-lg ${streak > 0 ? (streak >= 7 ? 'text-white' : 'text-gray-300') : 'text-gray-600'}`}>
                  {streak}
              </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Content 
               className="bg-[#141414] border border-[#2A2A2A] text-white text-xs px-3 py-2 rounded-lg shadow-xl"
               sideOffset={5}
            >
                {getMessage()}
                <Tooltip.Arrow className="fill-[#141414]" />
            </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
