'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Flame, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Habit {
  id: string;
  title: string;
  icon: string;
  category: string;
  xpReward: number;
  currentStreak: number;
  lastCompletedAt: string | null;
}

export function HabitListToday({ habits, onComplete }: { habits: Habit[], onComplete: (id: string, xp: number) => void }) {
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  const isCompletedToday = (lastCompletedAt: string | null) => {
      if (!lastCompletedAt) return false;
      const date = new Date(lastCompletedAt);
      const today = new Date();
      return date.toDateString() === today.toDateString();
  };

  const handleComplete = (habit: Habit) => {
      if (isCompletedToday(habit.lastCompletedAt)) return;
      setAnimatingId(habit.id);
      setTimeout(() => {
          onComplete(habit.id, habit.xpReward);
          setAnimatingId(null);
      }, 800); // Wait for burst animation
  };

  if (habits.length === 0) {
      return (
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4 text-gray-500">
                  <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">No habits today!</h3>
              <p className="text-gray-400 mb-6 max-w-xs mx-auto">Start forging your first habit and earn your starter XP.</p>
              <Button className="bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black">
                  <Plus className="w-4 h-4 mr-2" /> Add Habit
              </Button>
          </div>
      );
  }

  return (
    <div className="space-y-3">
        <h2 className="text-lg font-heading font-bold text-gray-300 px-2">YOUR MISSIONS</h2>
        <div className="space-y-2">
            <AnimatePresence>
                {habits.map((habit) => {
                    const completed = isCompletedToday(habit.lastCompletedAt);
                    const isAnimating = animatingId === habit.id;

                    return (
                        <motion.div 
                            key={habit.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                                completed 
                                ? 'bg-[#0A0A0A] border-[#2A2A2A] opacity-50' 
                                : 'bg-[#141414] border-[#3A3A3A] hover:bg-[#1A1A1A]'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-[#1E1E1E] flex items-center justify-center text-2xl border border-[#2A2A2A]">
                                    {habit.icon || '🎯'}
                                </div>
                                <div>
                                    <h3 className={`font-bold font-heading text-lg ${completed ? 'line-through text-gray-500' : 'text-white'}`}>
                                        {habit.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs font-mono mt-1">
                                        <span className="px-2 py-0.5 rounded-full bg-[#2A2A2A] text-gray-300">{habit.category}</span>
                                        <span className="flex items-center text-[#FF6B00] font-bold">
                                            <Flame className="w-3 h-3 mr-1" /> {habit.currentStreak}
                                        </span>
                                        <span className="text-[#FFD700]">+{habit.xpReward} XP</span>
                                    </div>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => handleComplete(habit)}
                                disabled={completed || isAnimating}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                                    completed 
                                    ? 'bg-[#22C55E] border-[#22C55E] text-[#0A0A0A]' 
                                    : 'border-[#3A3A3A] hover:border-[#FF6B00] text-transparent'
                                }`}
                            >
                                {completed && <Check className="w-5 h-5" />}
                                {isAnimating && (
                                    <>
                                        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                                            {/* Particle Burst Native */}
                                            <div className="absolute w-2 h-2 bg-[#FFD700] rounded-full animate-[ping_0.5s_ease-out_forwards]" />
                                            <motion.span 
                                                initial={{ y: 0, opacity: 1, scale: 1 }} 
                                                animate={{ y: -40, opacity: 0, scale: 1.5 }}
                                                className="absolute text-[#FFD700] font-bold font-display text-xl z-50"
                                            >
                                                +{habit.xpReward} XP
                                            </motion.span>
                                        </div>
                                    </>
                                )}
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    </div>
  );
}
