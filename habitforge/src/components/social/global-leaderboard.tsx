'use client';

import { ArrowUp, ArrowDown, Minus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function GlobalLeaderboard({ leaderboardData }: { leaderboardData: any }) {
    const [friendsOnly, setFriendsOnly] = useState(false);

    if (!leaderboardData) return null;
    const { data: users, userRank, totalPlayers } = leaderboardData;

    // Guaranteed top 3 for podium
    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Controls */}
            <div className="flex justify-between items-center bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4">
                <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-gray-300">Global Rankings</h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">Friends Only</span>
                    <button 
                        onClick={() => setFriendsOnly(!friendsOnly)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${friendsOnly ? 'bg-[#22C55E]' : 'bg-[#2A2A2A]'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${friendsOnly ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-4 md:gap-8 pt-8 pb-12">
                {/* Pos 2 */}
                {top3[1] && (
                    <div className="flex flex-col items-center group">
                        <div className="relative mb-2">
                             <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full border-4 border-gray-400 flex items-center justify-center text-3xl z-10 relative">{top3[1].emoji}</div>
                             <div className="absolute -bottom-2 -right-2 bg-gray-400 text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-20">2</div>
                        </div>
                        <span className="font-bold text-sm mb-1">{top3[1].name}</span>
                        <span className="text-[#FFD700] text-xs font-mono font-bold mb-4">{top3[1].xp.toLocaleString()} XP</span>
                        <div className="w-20 md:w-24 h-24 bg-gradient-to-t from-gray-500/20 to-gray-400/50 rounded-t-lg border-t-2 border-gray-400 shadow-[0_-5px_20px_rgba(156,163,175,0.2)]" />
                    </div>
                )}
                
                {/* Pos 1 */}
                {top3[0] && (
                    <div className="flex flex-col items-center group relative z-10 -mt-8">
                        <Crown className="w-8 h-8 text-[#FFD700] mb-2 -translate-y-2 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
                        <div className="relative mb-2">
                             <div className="w-20 h-20 md:w-28 md:h-28 bg-[#141414] rounded-full border-4 border-[#FFD700] flex items-center justify-center text-5xl z-10 relative shadow-[0_0_30px_rgba(255,215,0,0.3)]">{top3[0].emoji}</div>
                             <div className="absolute -bottom-2 right-0 bg-[#FFD700] text-black text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center z-20">1</div>
                        </div>
                        <span className="font-bold text-base md:text-lg mb-1">{top3[0].name}</span>
                        <span className="text-[#FFD700] text-sm font-mono font-bold mb-4">{top3[0].xp.toLocaleString()} XP</span>
                        <div className="w-24 md:w-32 h-36 bg-gradient-to-t from-[rgba(255,215,0,0.1)] to-[rgba(255,215,0,0.4)] rounded-t-lg border-t-4 border-[#FFD700] shadow-[0_-10px_30px_rgba(255,215,0,0.3)]" />
                    </div>
                )}

                {/* Pos 3 */}
                {top3[2] && (
                    <div className="flex flex-col items-center group">
                        <div className="relative mb-2">
                             <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full border-4 border-[#CD7F32] flex items-center justify-center text-3xl z-10 relative">{top3[2].emoji}</div>
                             <div className="absolute -bottom-2 -right-2 bg-[#CD7F32] text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center z-20">3</div>
                        </div>
                        <span className="font-bold text-sm mb-1">{top3[2].name}</span>
                        <span className="text-[#FFD700] text-xs font-mono font-bold mb-4">{top3[2].xp.toLocaleString()} XP</span>
                        <div className="w-20 md:w-24 h-16 bg-gradient-to-t from-[rgba(205,127,50,0.1)] to-[rgba(205,127,50,0.4)] rounded-t-lg border-t-2 border-[#CD7F32] shadow-[0_-5px_20px_rgba(205,127,50,0.2)]" />
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#0A0A0A] border-b border-[#2A2A2A] text-gray-500 font-mono text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-16 text-center">Rank</th>
                            <th className="p-4">Player</th>
                            <th className="p-4 hidden sm:table-cell w-24 text-center">Level</th>
                            <th className="p-4 w-32 text-right">XP</th>
                            <th className="p-4 hidden sm:table-cell w-32 text-right">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rest.map((user: any, idx: number) => {
                            const isCurrentUser = user.name === 'You';
                            const rank = idx + 4; // since top 3 are separated
                            return (
                                <tr key={user.id} className={`border-b border-[#2A2A2A] transition-colors ${isCurrentUser ? 'bg-[#FF6B00]/10 border-l-4 border-l-[#FF6B00]' : 'hover:bg-[#1A1A1A] border-l-4 border-l-transparent'}`}>
                                    <td className="p-4 flex items-center justify-center gap-2 font-mono font-bold text-gray-400">
                                        <div className="flex flex-col items-center w-4">
                                            {user.rankArrow === 'UP' && <ArrowUp className="w-3 h-3 text-[#22C55E]" />}
                                            {user.rankArrow === 'DOWN' && <ArrowDown className="w-3 h-3 text-red-500" />}
                                            {user.rankArrow === 'NONE' && <Minus className="w-3 h-3 text-gray-600" />}
                                        </div>
                                        {rank}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{user.emoji}</span>
                                            <span className={`font-bold ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>{user.name}</span>
                                            {isCurrentUser && <span className="bg-[#FF6B00] text-black text-[10px] font-bold px-2 py-0.5 rounded ml-2 uppercase">You</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell text-center">
                                        <span className="bg-[#2A2A2A] text-gray-300 font-bold px-2 py-1 rounded text-xs">Lvl {user.level}</span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-[#FFD700]">
                                        {user.xp.toLocaleString()}
                                    </td>
                                    <td className="p-4 hidden sm:table-cell text-right font-mono font-bold text-gray-400">
                                        {user.streak} <span className="text-[#FF6B00]">🔥</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="p-4 text-center bg-[#0A0A0A]">
                    <Button variant="ghost" className="text-gray-500 hover:text-white uppercase text-xs tracking-wider">Load More Rankings</Button>
                </div>
            </div>

            <div className="text-center font-mono text-gray-500">
                Your Rank: <span className="text-[#FF6B00] font-bold">#{userRank}</span> of {totalPlayers} players
            </div>
        </div>
    );
}
