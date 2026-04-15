'use client';

import { Bot, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ActivePathCardProps {
  activePaths: {
      path: {
          id: string;
          title: string;
          durationDays: number;
          currentDay: number;
      };
      todayTask: {
          id: string;
          title: string;
          description: string;
      } | null;
  }[];
}

export function ActivePathCard({ activePaths }: ActivePathCardProps) {
  if (!activePaths || activePaths.length === 0) {
      return (
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center mb-4 border border-[#2A2A2A]">
                  <Bot className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-2">No Active Quests</h3>
              <p className="text-gray-400 text-sm mb-6 max-w-xs">Generate an AI learning path and master a new skill step-by-step.</p>
              <Link href="/paths/new">
                  <Button className="bg-[#FFD700] text-black hover:bg-white font-bold w-full">
                      Start an AI Path
                  </Button>
              </Link>
          </div>
      );
  }

  const { path, todayTask } = activePaths[0]; // Just showing the primary one

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] border-t-4 border-t-[#FFD700] rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
        {/* Background circuit subtle */}
        <div className="absolute right-[-10%] bottom-[-20%] opacity-5 pointer-events-none">
            <Bot className="w-64 h-64 text-[#FFD700]" />
        </div>

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded-sm">Current Path</span>
                <h3 className="font-heading font-bold text-xl mt-2">{path.title}</h3>
            </div>
            <div className="text-right">
                <span className="text-sm font-mono text-gray-400">Day <span className="text-white font-bold">{path.currentDay}</span> / {path.durationDays}</span>
            </div>
        </div>

        <div className="flex-1 mt-2 relative z-10">
            {todayTask ? (
               <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-4">
                   <h4 className="font-bold text-sm mb-2">{todayTask.title}</h4>
                   <p className="text-xs text-gray-400 line-clamp-2">{todayTask.description}</p>
                   
                   <Button className="w-full mt-4 bg-[#22C55E] hover:bg-green-400 text-black font-bold h-10">
                       <CheckCircle2 className="w-4 h-4 mr-2" /> Complete Task
                   </Button>
               </div>
            ) : (
                <div className="flex items-center justify-center p-6 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] text-gray-400 text-sm font-mono text-center">
                    Task completed for today. <br/> Rest up for tomorrow.
                </div>
            )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#2A2A2A] relative z-10">
            <Link href={`/paths/${path.id}`} className="text-xs font-bold text-[#FFD700] hover:text-white uppercase tracking-wider flex items-center">
                View Full Path <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
        </div>
    </div>
  );
}
