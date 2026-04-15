'use client';

import { Shield, Medal, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

interface Badge {
    id: string;
    badge: {
        name: string;
        rarity: string;
        icon: string;
    }
}

export function RecentBadges({ badges }: { badges: Badge[] }) {
  const getRarityColor = (rarity: string) => {
    switch(rarity.toLowerCase()) {
        case 'legendary': return 'text-[#FF6B00] border-[#FF6B00] bg-[#FF6B00]/10';
        case 'epic': return 'text-[#FFD700] border-[#FFD700] bg-[#FFD700]/10';
        case 'rare': return 'text-[#22C55E] border-[#22C55E] bg-[#22C55E]/10';
        case 'uncommon': return 'text-gray-300 border-gray-400 bg-gray-500/10';
        default: return 'text-gray-500 border-gray-600 bg-gray-800/50';
    }
  };

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
           <h3 className="font-heading font-bold text-lg text-white">Latest Honors</h3>
           <Link href="/profile/badges" className="text-xs text-gray-500 hover:text-white font-semibold">View All</Link>
       </div>

       <div className="flex-1 flex gap-3">
           {badges.slice(0, 3).map((b, i) => (
               <div key={b.id || i} className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border ${getRarityColor(b.badge.rarity)}`}>
                   <div className="text-3xl mb-2">{b.badge.icon}</div>
                   <span className="text-[10px] font-bold text-center leading-tight">{b.badge.name}</span>
               </div>
           ))}
           
           {/* Empty slots if less than 3 */}
           {Array.from({ length: Math.max(0, 3 - badges.length) }).map((_, i) => (
               <div key={`empty-${i}`} className="flex-1 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-[#3A3A3A] text-gray-600 bg-[#0A0A0A]">
                   <Shield className="w-6 h-6 mb-2 opacity-50" />
                   <span className="text-[10px] uppercase font-bold tracking-wider">Locked</span>
               </div>
           ))}
       </div>
    </div>
  );
}
