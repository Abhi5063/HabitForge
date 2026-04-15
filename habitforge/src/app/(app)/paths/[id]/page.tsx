'use client';

import { useParams } from 'next/navigation';
import { usePathDetail } from '@/hooks/usePaths';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Target, Clock, ArrowRight, Play, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function PathDetailPage() {
    const params = useParams();
    const { path, isLoading, completeTask, isCompleting } = usePathDetail(params.id as string);
    const [taskNotes, setTaskNotes] = useState('');
    const [confidence, setConfidence] = useState(0);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" /></div>;
    }

    if (!path) {
        return <div className="text-center p-20 text-red-500 font-bold">Path not found</div>;
    }

    // Logic setup
    const todayIndex = path.currentDay - 1;
    const currentTask = path.plan ? path.plan[todayIndex] : null;
    const isTodayCompleted = currentTask?.isCompleted;

    const completedCount = path.plan ? path.plan.filter((t: any) => t.isCompleted).length : 0;
    const progressPct = path.plan ? (completedCount / path.durationDays) * 100 : 0;

    const handleComplete = async () => {
        if (!currentTask) return;
        await completeTask({ taskId: currentTask.id, notes: taskNotes, difficulty: confidence });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* HERO */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] opacity-5 blur-[100px]" />
                 
                 <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                    
                    <div className="relative w-32 h-32 flex-shrink-0">
                        <svg className="transform -rotate-90 w-full h-full">
                            <circle cx="64" cy="64" r="60" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                            <circle 
                                cx="64" cy="64" r="60" 
                                stroke="#FFD700" strokeWidth="8" fill="none" 
                                strokeDasharray={377}
                                strokeDashoffset={377 - (progressPct / 100) * 377}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold font-mono">{Math.round(progressPct)}%</span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="bg-[#1A1A1A] border border-[#3A3A3A] px-2 py-1 rounded text-xs font-bold text-gray-400 uppercase tracking-widest">{path.durationDays} Days</span>
                           <span className="bg-[#1A1A1A] border border-[#3A3A3A] px-2 py-1 rounded text-xs font-bold text-[#FFD700] uppercase tracking-widest">{path.dailyMinutes} MIN/DAY</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-3">{path.title}</h1>
                        <p className="text-gray-400 italic">"{path.goal}"</p>
                    </div>

                 </div>
            </div>

            {/* TWO COLUMNS: Active Task vs Calendar Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* LEFT COL: TODAY'S HIGHLIGHT (7 cols) */}
                <div className="xl:col-span-7 space-y-6">
                    <h2 className="text-2xl font-display tracking-widest text-gray-300">CURRENT OPERATION</h2>
                    
                    {currentTask ? (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`bg-[#141414] border-2 rounded-3xl p-6 md:p-8 transition-colors ${isTodayCompleted ? 'border-[#22C55E]' : 'border-[#FF6B00]'}`}>
                            
                            <div className="flex justify-between items-start mb-6 border-b border-[#2A2A2A] pb-4">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${isTodayCompleted ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-[#FF6B00]/20 text-[#FF6B00]'}`}>
                                        Day {currentTask.dayNumber} {isTodayCompleted && '• Completed'}
                                    </span>
                                    <h3 className="text-2xl font-bold font-heading">{currentTask.title}</h3>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-gray-900 border border-[#2A2A2A] flex items-center justify-center font-mono font-bold text-[#FFD700] shadow-inner">
                                        +150
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase">XP Reward</p>
                                </div>
                            </div>

                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {currentTask.description}
                            </p>

                            {/* Resources */}
                            {currentTask.resources && currentTask.resources.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-3 flex items-center"><Target className="w-4 h-4 mr-2" /> Recommended Resources</h4>
                                    <div className="flex flex-col gap-2">
                                        {currentTask.resources.map((res: any, idx: number) => (
                                            <a key={idx} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] hover:border-gray-500 transition-colors group">
                                                <span className="font-bold text-sm group-hover:text-[#FFD700] transition-colors">{res.title}</span>
                                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#FFD700]" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!isTodayCompleted ? (
                                <div className="space-y-4 pt-6 border-t border-[#2A2A2A]">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-400 mb-2 block">Personal Notes (Optional)</label>
                                        <textarea 
                                            placeholder="What did you learn today? What was difficult?"
                                            value={taskNotes}
                                            onChange={e => setTaskNotes(e.target.value)}
                                            className="w-full h-24 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4 text-sm focus:border-[#FF6B00] outline-none resize-none"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-semibold text-gray-400 mb-2 block">Confidence Level</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button 
                                                    key={star} 
                                                    onClick={() => setConfidence(star)}
                                                    className={`w-10 h-10 rounded-full text-lg flex items-center justify-center border transition-all ${confidence >= star ? 'border-[#FFD700] bg-[#FFD700]/20 text-[#FFD700]' : 'border-[#3A3A3A] bg-[#141414] text-gray-600 hover:border-gray-500'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleComplete} 
                                        disabled={isCompleting}
                                        className="w-full bg-[#22C55E] hover:bg-green-400 text-black font-bold h-14 text-lg rounded-xl mt-4"
                                    >
                                        {isCompleting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-5 h-5 mr-2" /> Mark Day Complete</>}
                                    </Button>
                                </div>
                            ) : (
                                <div className="pt-6 border-t border-[#2A2A2A] text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#22C55E]/20 mb-4">
                                        <Check className="w-8 h-8 text-[#22C55E]" />
                                    </div>
                                    <h4 className="font-bold text-xl text-white mb-2">Rest Phase Active</h4>
                                    <p className="text-gray-400 text-sm">You've successfully completed today's operation. Tomorrow's task unlocks at midnight.</p>
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 text-center text-gray-500">
                             Path data unreadable or malformed.
                        </div>
                    )}
                </div>

                {/* RIGHT COL: MATRIX GRID (5 cols) */}
                <div className="xl:col-span-5 space-y-6">
                    <h2 className="text-2xl font-display tracking-widest text-gray-300 mb-6 flex justify-between items-end">
                        <span>THE MATRIX</span>
                        <span className="text-xs font-mono font-normal">Day {path.currentDay} / {path.durationDays}</span>
                    </h2>

                    <div className="bg-[#141414] border border-[#2A2A2A] p-6 rounded-3xl">
                        <div className="grid grid-cols-7 gap-2">
                            {path.plan?.map((gridTask: any) => {
                                const isPast = gridTask.dayNumber < path.currentDay;
                                const isCurrent = gridTask.dayNumber === path.currentDay;
                                const isDone = gridTask.isCompleted;

                                let styles = "bg-[#0A0A0A] border-[#2A2A2A] text-gray-600"; // Future
                                if (isDone) styles = "bg-[#22C55E] border-[#22C55E] text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]"; // Completed
                                else if (isCurrent) styles = "bg-[#FF6B00]/20 border-[#FF6B00] text-[#FF6B00] ring-1 ring-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.4)]"; // Active
                                else if (isPast && !isDone) styles = "bg-red-900/30 border-red-500/50 text-red-500"; // Missed (edge case logic for future expansions)

                                return (
                                    <div 
                                        key={gridTask.id}
                                        title={`Day ${gridTask.dayNumber}: ${gridTask.title}`}
                                        className={`aspect-square rounded-md border flex items-center justify-center font-mono text-xs font-bold transition-all cursor-help ${styles}`}
                                    >
                                        {gridTask.dayNumber}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#2A2A2A] px-2">
                             <div className="flex items-center gap-2 text-xs text-gray-400 font-mono"><div className="w-3 h-3 bg-[#22C55E] rounded-sm" /> Done</div>
                             <div className="flex items-center gap-2 text-xs text-gray-400 font-mono"><div className="w-3 h-3 bg-[#FF6B00]/20 border border-[#FF6B00] rounded-sm" /> Active</div>
                             <div className="flex items-center gap-2 text-xs text-gray-400 font-mono"><div className="w-3 h-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-sm" /> Locked</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
