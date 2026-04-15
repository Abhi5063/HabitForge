'use client';

import { Check, Edit, Trash2, Archive, History } from 'lucide-react';
import { StreakDisplay } from './streak-display';
import { useState } from 'react';

interface HabitCardProps {
    habit: {
        id: string;
        title: string;
        icon: string;
        color: string;
        category: string;
        frequency: string;
        xpReward: number;
        currentStreak: number;
        lastCompletedAt: string | null;
        isArchived: boolean;
    };
    onComplete: (id: string) => void;
    onEdit: (habit: any) => void;
    onArchive: (id: string, currentlyArchived: boolean) => void;
    onDelete: (id: string) => void;
    onViewDetail: (id: string) => void;
}

export function HabitCard({ habit, onComplete, onEdit, onArchive, onDelete, onViewDetail }: HabitCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Determines if completed today (naive timezone-less check assuming UTC/Local matches for simplicity)
    const isCompleted = habit.lastCompletedAt 
        ? new Date(habit.lastCompletedAt).toDateString() === new Date().toDateString() 
        : false;

    // Next multiplier milestone (7, 30, 100)
    let nextMilestone = 7;
    if (habit.currentStreak >= 7) nextMilestone = 30;
    if (habit.currentStreak >= 30) nextMilestone = 100;
    
    // Progress calculation specifically towards next milestone bounds
    let prevMilestone = 0;
    if (habit.currentStreak >= 7) prevMilestone = 7;
    if (habit.currentStreak >= 30) prevMilestone = 30;

    const progressPct = Math.min(100, Math.max(0, ((habit.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100));

    return (
        <div 
            className="group relative bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#FF6B00] transition-all transform hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(255,107,0,0.15)] flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onViewDetail(habit.id)}>
                    <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: `${habit.color}20`, color: habit.color, border: `1px solid ${habit.color}50` }}
                    >
                        {habit.icon}
                    </div>
                    <div>
                        <h3 className={`font-heading font-bold text-xl ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{habit.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 bg-[#1A1A1A] text-gray-400 rounded border border-[#3A3A3A] uppercase">{habit.category}</span>
                            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 bg-[#1A1A1A] text-gray-400 rounded border border-[#3A3A3A] uppercase">{habit.frequency.slice(0, 3)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end gap-2">
                    <StreakDisplay streak={habit.currentStreak} />
                    <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">+{habit.xpReward} XP</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-[#2A2A2A]">
                <div className="flex justify-between text-xs text-gray-500 mb-1 font-mono">
                    <span>Streak Progress</span>
                    <span>{nextMilestone - habit.currentStreak} days to {nextMilestone}</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#22C55E] to-[#FFD700] transition-all duration-1000" 
                        style={{ width: `${progressPct}%` }} 
                    />
                </div>
            </div>

            {/* Hover Actions Actions Float over top right */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-full p-1 transition-opacity duration-200 ${isHovered ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
                 <button onClick={() => onComplete(habit.id)} disabled={isCompleted} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'text-gray-600 bg-transparent' : 'text-[#22C55E] hover:bg-[#22C55E]/20'}`} title="Complete">
                    <Check className="w-4 h-4" />
                 </button>
                 <button onClick={() => onViewDetail(habit.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-colors" title="Details">
                    <History className="w-4 h-4" />
                 </button>
                 <button onClick={() => onEdit(habit)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FFD700] hover:bg-[#1A1A1A] transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                 </button>
                 <button onClick={() => onArchive(habit.id, habit.isArchived)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1A1A1A] transition-colors" title={habit.isArchived ? "Unarchive" : "Archive"}>
                    <Archive className="w-4 h-4" />
                 </button>
                 <button onClick={() => onDelete(habit.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-[#1A1A1A] transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                 </button>
            </div>
        </div>
    );
}
