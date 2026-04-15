'use client';

import { Search, UserPlus, X, Check, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function FriendsList({ friendsData }: { friendsData: any }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = (v: string) => {
        setSearchQuery(v);
        // Simulate debounce search fetch
        if (v.length > 2) {
            setSearchResults([
                { id: 'usr-s1', name: 'Alex Johnson', level: 10, emoji: '⚡' }
            ]);
        } else {
            setSearchResults([]);
        }
    };

    if (!friendsData) return null;
    const { friends, pending } = friendsData;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
            {/* LEFT: MY FRIENDS */}
            <div className="lg:col-span-2 space-y-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading font-bold text-xl uppercase tracking-widest text-gray-300">My Friends ({friends.length})</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {friends.map((f: any) => (
                         <div key={f.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex items-center justify-between hover:border-gray-600 transition-colors">
                             <div className="flex items-center gap-3">
                                 <div className="w-12 h-12 rounded-full bg-[#0A0A0A] border border-[#3A3A3A] flex items-center justify-center text-2xl">{f.emoji}</div>
                                 <div className="flex flex-col">
                                     <span className="font-bold text-sm text-white">{f.name}</span>
                                     <div className="flex items-center gap-2 mt-1">
                                         <span className="bg-[#2A2A2A] text-gray-300 text-[10px] px-1.5 py-0.5 rounded font-bold">Lvl {f.level}</span>
                                         <span className="text-[#FFD700] font-mono text-[10px] font-bold">{f.xp.toLocaleString()} XP</span>
                                     </div>
                                 </div>
                             </div>
                             <div className="flex flex-col items-end gap-2">
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10">Remove</Button>
                                <span className="font-mono text-xs font-bold text-gray-400">{f.streak} 🔥</span>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>

            {/* RIGHT: SEARCH & PENDING */}
            <div className="space-y-8">
                {/* Find Users */}
                <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
                    <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Find Forgers</h3>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input 
                            placeholder="Username or display name..." 
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-9 bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FF6B00]"
                        />
                    </div>
                    {/* Results Dropdown simulated below */}
                    {searchResults.length > 0 && searchQuery.length > 2 && (
                         <div className="space-y-2 mt-4 pt-4 border-t border-[#2A2A2A]">
                             {searchResults.map((r: any) => (
                                 <div key={r.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                                      <div className="flex items-center gap-2">
                                          <span>{r.emoji}</span>
                                          <div className="text-xs font-bold">{r.name}</div>
                                      </div>
                                      <Button size="sm" className="h-6 px-2 bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-[10px] font-bold">Add</Button>
                                 </div>
                             ))}
                         </div>
                    )}
                    {searchResults.length === 0 && searchQuery.length > 2 && (
                         <div className="text-center py-4 text-gray-500 text-xs">No users found.</div>
                    )}
                </div>

                {/* Pending Requests */}
                {(pending.incoming.length > 0 || pending.outgoing.length > 0) && (
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6">
                        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Pending Requests</h3>
                        
                        {pending.incoming.length > 0 && (
                            <div className="space-y-3 mb-6">
                                <span className="text-xs font-bold text-gray-500 uppercase">Incoming</span>
                                {pending.incoming.map((req: any) => (
                                    <div key={req.id} className="flex justify-between items-center bg-[#0A0A0A] p-2 rounded-lg border border-[#3A3A3A]">
                                         <div className="flex items-center gap-2">
                                             <span>{req.emoji}</span>
                                             <div className="text-xs font-bold">{req.name}</div>
                                         </div>
                                         <div className="flex gap-1">
                                             <button className="w-6 h-6 rounded bg-[#22C55E]/20 text-[#22C55E] flex items-center justify-center hover:bg-[#22C55E] hover:text-black transition-colors"><Check className="w-3 h-3" /></button>
                                             <button className="w-6 h-6 rounded bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black transition-colors"><X className="w-3 h-3" /></button>
                                         </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pending.outgoing.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-gray-500 uppercase">Outgoing</span>
                                {pending.outgoing.map((req: any) => (
                                    <div key={req.id} className="flex justify-between items-center bg-[#0A0A0A] p-2 rounded-lg border border-[#3A3A3A]">
                                         <div className="flex items-center gap-2 opacity-50">
                                             <span>{req.emoji}</span>
                                             <div className="text-xs font-bold">{req.name}</div>
                                         </div>
                                         <button className="text-[10px] text-gray-500 hover:text-red-500 uppercase font-bold">Cancel</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
