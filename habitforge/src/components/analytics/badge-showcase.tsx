'use client';

import { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface Badge {
    id: string; // empty if unearned
    name: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
    criteria: string;
    icon: string;
    earnedAt: string | null;
}

export function BadgeShowcase({ badges }: { badges: Badge[] }) {
    const [filter, setFilter] = useState<'ALL' | 'EARNED' | 'LOCKED'>('ALL');
    const [rarityFilter, setRarityFilter] = useState<string>('ALL');

    const filtered = badges.filter(b => {
        if (filter === 'EARNED' && !b.earnedAt) return false;
        if (filter === 'LOCKED' && b.earnedAt) return false;
        if (rarityFilter !== 'ALL' && b.rarity.toUpperCase() !== rarityFilter) return false;
        return true;
    });

    const getRarityStyle = (rarity: string) => {
        switch(rarity.toLowerCase()) {
            case 'legendary': return { bg: 'bg-[#FF6B00]/10', border: 'border-[#FF6B00]', text: 'text-[#FF6B00]', shadow: 'shadow-[0_0_15px_rgba(255,107,0,0.5)]' };
            case 'epic': return { bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]', text: 'text-[#FFD700]', shadow: 'shadow-[0_0_15px_rgba(255,215,0,0.5)]' };
            case 'rare': return { bg: 'bg-[#22C55E]/10', border: 'border-[#22C55E]', text: 'text-[#22C55E]', shadow: 'shadow-[0_0_15px_rgba(34,197,94,0.5)]' };
            case 'uncommon': return { bg: 'bg-gray-500/10', border: 'border-gray-400', text: 'text-gray-300', shadow: 'shadow-none' };
            default: return { bg: 'bg-gray-800/10', border: 'border-[#3A3A3A]', text: 'text-gray-500', shadow: 'shadow-none' };
        }
    };

    return (
        <div className="w-full bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[#2A2A2A] pb-4">
                <h3 className="font-heading font-bold text-gray-300 text-xl flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#FFD700]" /> Arsenal of Honor</h3>
                
                <div className="flex flex-wrap gap-4">
                    <div className="flex bg-[#0A0A0A] p-0.5 rounded-lg border border-[#2A2A2A]">
                        {(['ALL', 'EARNED', 'LOCKED'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${filter === f ? 'bg-[#FF6B00] text-white' : 'text-gray-500 hover:text-white'}`}>{f}</button>
                        ))}
                    </div>
                    <div className="flex bg-[#0A0A0A] p-0.5 rounded-lg border border-[#2A2A2A]">
                        {(['ALL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC'] as const).map(r => (
                            <button key={r} onClick={() => setRarityFilter(r)} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${rarityFilter === r ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-white'}`}>{r}</button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Tooltip.Provider>
                    {filtered.map((b, i) => {
                        const style = getRarityStyle(b.rarity);
                        const isLocked = !b.earnedAt;
                        
                        return (
                            <Tooltip.Root key={b.name + i} delayDuration={100}>
                                <Tooltip.Trigger asChild>
                                    <div className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all cursor-help
                                        ${isLocked ? 'bg-[#0A0A0A] border border-[#2A2A2A] opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : `${style.bg} border ${style.border} hover:-translate-y-2 hover:${style.shadow}`}
                                    `}>
                                        {isLocked && <Lock className="absolute top-2 right-2 w-3 h-3 text-gray-500" />}
                                        <div className="text-4xl mb-2 filter drop-shadow-xl">{b.icon}</div>
                                        <h4 className="text-[10px] font-bold text-center tracking-wider uppercase leading-tight line-clamp-2">{b.name}</h4>
                                        {!isLocked && <div className={`text-[8px] mt-1 font-mono font-bold px-1 rounded ${style.bg} ${style.border} border`}>{b.rarity}</div>}
                                    </div>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content className="bg-[#0A0A0A] border border-[#2A2A2A] p-3 rounded-xl shadow-2xl z-50 max-w-[200px]" sideOffset={5}>
                                        <p className={`font-bold text-sm mb-1 ${isLocked ? 'text-gray-400' : style.text}`}>{b.name}</p>
                                        <p className="text-gray-300 text-xs mb-2">{b.criteria}</p>
                                        {isLocked ? (
                                            <p className="text-gray-600 text-[10px] font-mono border-t border-[#2A2A2A] pt-1">Locked</p>
                                        ) : (
                                            <p className="text-[#22C55E] text-[10px] font-mono border-t border-[#2A2A2A] pt-1">Earned on {new Date(b.earnedAt!).toLocaleDateString()}</p>
                                        )}
                                        <Tooltip.Arrow className="fill-[#0A0A0A]" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        );
                    })}
                </Tooltip.Provider>

                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 font-mono text-sm border-2 border-dashed border-[#2A2A2A] rounded-2xl">
                        No badges matching criteria. 🛡️
                    </div>
                )}
            </div>
        </div>
    );
}
