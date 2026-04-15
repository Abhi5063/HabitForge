'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Calendar as CalendarIcon, CheckSquare, Zap, Target, TrendingUp, Edit2, Archive } from 'lucide-react';
import { StreakDisplay } from './streak-display';

interface Props {
  habit: any | null; // Can utilize strict type if shared
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (habit: any) => void;
  onArchive: (id: string, isArchived: boolean) => void;
}

export function HabitDetailSheet({ habit, open, onOpenChange, onEdit, onArchive }: Props) {
  if (!habit) return null;

  // Mock Calendar Data setup for standard heatmap visual
  const thirtyDays = Array.from({length: 30}).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
          date: d,
          completed: Math.random() > 0.5 // Simulated for display if missing completion history context
      }
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-[#0A0A0A] border-l border-[#2A2A2A] shadow-2xl overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
            
            {/* Header Sticky Array */}
            <div className="sticky top-0 z-10 bg-[#0A0A0A]/90 backdrop-blur pb-4">
                <div className="flex justify-between items-center p-6 pb-0">
                    <Dialog.Close asChild>
                        <button className="rounded-full w-8 h-8 flex items-center justify-center bg-[#141414] hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors border border-[#2A2A2A]">
                            <X className="w-4 h-4" />
                        </button>
                    </Dialog.Close>
                    <div className="flex gap-2">
                        <button onClick={() => { onOpenChange(false); onEdit(habit); }} className="px-3 py-1.5 rounded-lg bg-[#141414] text-gray-400 hover:text-white text-xs font-bold font-mono border border-[#2A2A2A] flex items-center gap-1">
                            <Edit2 className="w-3 h-3" /> Edit
                        </button>
                        <button onClick={() => { onOpenChange(false); onArchive(habit.id, habit.isArchived); }} className="px-3 py-1.5 rounded-lg bg-[#141414] text-gray-400 hover:text-red-500 text-xs font-bold font-mono border border-[#2A2A2A] flex items-center gap-1">
                            <Archive className="w-3 h-3" /> {habit.isArchived ? 'Restore' : 'Archive'}
                        </button>
                    </div>
                </div>

                <div className="px-6 mt-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border" style={{ backgroundColor: `${habit.color}15`, borderColor: `${habit.color}30` }}>
                        {habit.icon}
                    </div>
                    <div>
                        <h2 className="text-3xl font-heading font-bold">{habit.title}</h2>
                        <div className="flex gap-2 mt-2">
                           <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1A1A1A] text-gray-400 rounded-md border border-[#2A2A2A]">{habit.frequency}</span>
                           <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[#1A1A1A] text-gray-400 rounded-md border border-[#2A2A2A]">{habit.category}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {habit.description && (
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A] text-sm text-gray-300 italic">
                        "{habit.description}"
                    </div>
                )}

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1"><Zap className="w-3 h-3" /> Current Streak</div>
                        <StreakDisplay streak={habit.currentStreak} />
                    </div>
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Total Completes</div>
                        <div className="text-2xl font-display">{habit.completions?.length || 0}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1"><Target className="w-3 h-3" /> XP Earned</div>
                        <div className="text-2xl font-display text-[#FFD700]">{(habit.completions?.length || 0) * habit.xpReward}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div className="text-gray-400 text-xs font-semibold mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Success Rate</div>
                        <div className="text-2xl font-display text-[#22C55E]">85%</div>
                    </div>
                </div>

                {/* Simulated Heatmap */}
                <div>
                    <h3 className="font-heading font-bold text-lg mb-3 flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-gray-400" /> 30-Day Activity</h3>
                    <div className="p-4 rounded-xl bg-[#141414] border border-[#2A2A2A]">
                        <div className="flex flex-wrap gap-1.5">
                            {thirtyDays.map((day, i) => (
                                <div 
                                   key={i} 
                                   title={day.date.toLocaleDateString()}
                                   className="w-5 h-5 rounded-sm transition-colors cursor-pointer hover:ring-2 hover:ring-white" 
                                   style={{ backgroundColor: day.completed ? habit.color : '#2A2A2A' }} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Completion Log */}
                <div>
                    <h3 className="font-heading font-bold text-lg mb-3">Recent Logs</h3>
                    <div className="space-y-2">
                        {habit.completions?.slice(0, 5).map((log: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#141414] border border-[#2A2A2A]">
                                <span className="text-sm font-mono text-gray-300">{new Date(log.completedAt).toLocaleDateString()}</span>
                                <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">+{log.xpEarned} XP</span>
                            </div>
                        ))}
                        {(!habit.completions || habit.completions.length === 0) && (
                            <div className="text-center p-4 text-gray-500 text-sm border border-dashed border-[#2A2A2A] rounded-xl">No logs found.</div>
                        )}
                    </div>
                </div>

            </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
