'use client';

import { Users, Plus, Target, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { CreateGroupModal } from './create-group-modal';

export function GroupsPanel({ groupsData }: { groupsData: any }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    if (!groupsData) return null;
    const { myGroups, discoverGroups } = groupsData;

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
                <div>
                     <h2 className="font-heading font-bold text-3xl uppercase tracking-widest text-white mb-2">Guilds & Groups</h2>
                     <p className="text-gray-400 font-mono text-sm max-w-md">Join forces with other forgers to complete massive XP challenges collectively.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-[#FFD700] text-black hover:bg-white font-bold h-12">
                    <Plus className="w-4 h-4 mr-2" /> Start Group
                </Button>
            </div>

            <div className="space-y-6">
                <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-gray-500 border-b border-[#2A2A2A] pb-2">My Active Groups</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myGroups.map((g: any) => {
                        const progressPct = Math.min(100, (g.currentXp / g.xpGoal) * 100);
                        return (
                            <Link key={g.id} href={`/social/groups/${g.id}`}>
                                <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#FFD700] transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-[#0A0A0A] rounded-xl flex items-center justify-center text-3xl border border-[#3A3A3A] group-hover:scale-110 transition-transform">{g.icon}</div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Users className="w-3 h-3" /> {g.memberCount} Members</span>
                                    </div>
                                    <h4 className="font-bold text-xl mb-4">{g.name}</h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-mono font-bold">
                                            <span className="text-[#FFD700]">{g.currentXp.toLocaleString()} XP</span>
                                            <span className="text-gray-500">Goal: {g.xpGoal.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-full overflow-hidden">
                                            <div className="h-full bg-[#FFD700] transition-all" style={{ width: `${progressPct}%` }} />
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex justify-between items-center">
                                        <span className="text-xs text-red-500 font-bold uppercase">{g.daysRemaining} days left</span>
                                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-[#FFD700]" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-6 pt-8">
                <h3 className="font-heading font-bold text-lg uppercase tracking-wider text-gray-500 border-b border-[#2A2A2A] pb-2">Discover Groups</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {discoverGroups.map((g: any) => (
                        <div key={g.id} className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-5 flex flex-col">
                             <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 bg-[#141414] rounded-lg flex items-center justify-center text-xl">{g.icon}</div>
                                  <div className="flex-1">
                                      <h4 className="font-bold text-sm text-white line-clamp-1">{g.name}</h4>
                                      <span className="text-[10px] text-gray-500 font-mono">{g.memberCount} members</span>
                                  </div>
                             </div>
                             <div className="text-xs text-gray-400 font-mono mb-4 text-center">
                                 Goal: <span className="font-bold text-white">{g.xpGoal / 1000}k XP</span>
                             </div>
                             <Button className="w-full mt-auto bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E] hover:text-black text-xs font-bold h-8">
                                 Join Group
                             </Button>
                        </div>
                    ))}
                </div>
            </div>

            <CreateGroupModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
        </div>
    );
}
