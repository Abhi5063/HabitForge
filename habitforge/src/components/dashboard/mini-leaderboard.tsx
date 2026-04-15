'use client';

import { ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LeaderboardProps {
    users: { id: string; name: string; xp: number; emoji: string; isCurrentUser?: boolean }[];
    currentUserRank?: number | null;
}

export function MiniLeaderboard({ users, currentUserRank }: LeaderboardProps) {
  // Use dummy users for placeholder if empty (assume backend merges it anyway realistically)
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading font-bold text-lg text-white">Global Top 5</h3>
           <Link href="/leaderboard" className="text-xs text-[#22C55E] hover:text-white font-bold flex items-center">
               Full Standings <ArrowRight className="w-3 h-3 ml-1" />
           </Link>
       </div>

       <div className="flex-1 space-y-2">
           {users.slice(0, 5).map((user, idx) => (
               <div key={user.id} className={`flex items-center justify-between p-2 rounded-lg ${user.isCurrentUser ? 'bg-[#22C55E]/10 border border-[#22C55E]' : 'bg-[#0A0A0A] border border-[#2A2A2A]'}`}>
                   <div className="flex items-center gap-3">
                       <span className={`font-mono text-sm font-bold w-4 text-center ${idx === 0 ? 'text-[#FFD700]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-[#CD7F32]' : 'text-gray-500'}`}>{idx + 1}</span>
                       <span className="text-lg">{user.emoji}</span>
                       <span className="font-semibold text-sm truncate max-w-[100px]">{user.name}</span>
                   </div>
                   <span className="font-mono text-xs font-bold text-[#FF6B00]">{user.xp.toLocaleString()} XP</span>
               </div>
           ))}

           {currentUserRank && currentUserRank > 5 && (
               <>
                   <div className="flex justify-center py-1">
                       <div className="w-1 h-1 bg-[#3A3A3A] rounded-full mx-0.5" />
                       <div className="w-1 h-1 bg-[#3A3A3A] rounded-full mx-0.5" />
                       <div className="w-1 h-1 bg-[#3A3A3A] rounded-full mx-0.5" />
                   </div>
                   <div className="flex items-center justify-between p-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]">
                       <div className="flex items-center gap-3">
                           <span className="font-mono text-sm font-bold w-4 text-center text-[#22C55E]">{currentUserRank}</span>
                           <span className="text-lg">😎</span>
                           <span className="font-semibold text-sm text-white">You</span>
                       </div>
                   </div>
               </>
           )}
       </div>
    </div>
  );
}
