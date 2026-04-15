'use client';

import { Bot, ArrowRight, PauseCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PathCardProps {
    path: any;
}

export function PathCard({ path }: PathCardProps) {
    const isCompleted = path.status === 'COMPLETED';
    const isPaused = path.status === 'PAUSED';

    const borderColor = isCompleted ? 'border-[#22C55E]' : isPaused ? 'border-gray-500' : 'border-[#FFD700]';
    const progressPct = Math.min(100, Math.max(0, (path.currentDay / path.durationDays) * 100));

    // Simple Circular Progress SVG
    const radius = 24;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progressPct / 100) * circumference;

    return (
        <div className={`bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 transition-all hover:-translate-y-1 hover:border-[#FFD700] flex flex-col relative overflow-hidden group`}>
            {/* Top Border Accent */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isCompleted ? 'from-[#22C55E] to-green-400' : isPaused ? 'from-gray-500 to-gray-400' : 'from-[#FF6B00] to-[#FFD700]'}`} />

            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-gray-400">AI Curriculum</span>
                        {isCompleted && <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] px-2 py-0.5 rounded font-bold uppercase">Done</span>}
                        {isPaused && <span className="bg-gray-500/10 text-gray-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">Paused</span>}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-white line-clamp-2">{path.title}</h3>
                </div>

                {/* Circular Progress Indicator */}
                <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <svg className="transform -rotate-90 w-14 h-14">
                        <circle cx="28" cy="28" r={radius} stroke="#2A2A2A" strokeWidth="4" fill="none" />
                        <circle 
                            cx="28" cy="28" r={radius} 
                            stroke={isCompleted ? '#22C55E' : '#FFD700'} 
                            strokeWidth="4" fill="none" 
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center mt-1">
                        <span className="text-xs font-bold font-mono">{Math.round(progressPct)}%</span>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-400 mb-6 line-clamp-2 flex-1">
                "{path.goal}"
            </p>

            <div className="flex items-center justify-between mt-auto">
                <div className="text-xs font-mono font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded">
                    Total XP: {path.xpEarned || 0}
                </div>
                
                <Link href={`/paths/${path.id}`} className="w-full max-w-[140px]">
                    <Button variant="ghost" className={`w-full group-hover:bg-[#FFD700] group-hover:text-black group-hover:border-[#FFD700] transition-colors border-2 border-[#3A3A3A] bg-transparent text-white font-bold h-9 text-sm`}>
                        {isCompleted ? 'Review' : 'Continue'} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
