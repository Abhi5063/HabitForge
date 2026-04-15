'use client';

import { ArrowLeft, Users, Target, CalendarDays, Activity } from 'lucide-react';
import Link from 'next/link';

export default function GroupDetailPage() {
    // Simulated fetch parameters 
    const group = {
        name: '30 Days of Code',
        icon: '💻',
        description: 'Global developer challenge to hit daily coding goals consistently. Missing 2 days gets you kicked!',
        memberCount: 14,
        xpGoal: 50000,
        currentXp: 32000,
        daysRemaining: 12,
        members: [
            { id: '1', name: 'Arjun Sharma', xp: 4200, role: 'OWNER', emoji: '🦁' },
            { id: '2', name: 'You', xp: 3800, role: 'ADMIN', emoji: '😎' },
            { id: '3', name: 'Sofia Reyes', xp: 3100, role: 'MEMBER', emoji: '🌺' },
            { id: '4', name: 'Kenji Tanaka', xp: 2800, role: 'MEMBER', emoji: '🐉' }
        ],
        feed: [
            { user: 'Sofia Reyes', action: 'completed Python Day 12', xp: 150, time: '2 hours ago' },
            { user: 'Arjun Sharma', action: 'hit a 30-day streak!', xp: 500, time: '5 hours ago' },
            { user: 'Kenji Tanaka', action: 'completed Read Documentation', xp: 50, time: '1 day ago' },
        ]
    };

    const progressPct = Math.min(100, (group.currentXp / group.xpGoal) * 100);

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            <Link href="/social" className="inline-flex items-center text-gray-500 hover:text-white text-xs font-bold uppercase tracking-wider mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Network
            </Link>

            {/* Header */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
                <div className="w-24 h-24 bg-[#0A0A0A] rounded-2xl border border-[#3A3A3A] flex items-center justify-center text-5xl flex-shrink-0 z-10 shadow-xl">{group.icon}</div>
                
                <div className="flex-1 z-10">
                    <h1 className="text-3xl font-heading font-bold mb-2">{group.name}</h1>
                    <p className="text-gray-400 text-sm mb-6 max-w-2xl">{group.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span className="flex items-center gap-1 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-1.5 rounded-lg"><Users className="w-4 h-4 text-[#FFD700]" /> {group.memberCount} Members</span>
                        <span className="flex items-center gap-1 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-1.5 rounded-lg text-red-500"><CalendarDays className="w-4 h-4" /> {group.daysRemaining} Days Left</span>
                    </div>
                </div>

                <div className="absolute right-[-10%] top-[-50%] opacity-10 pointer-events-none text-[300px] blur-sm">
                    {group.icon}
                </div>
            </div>

            {/* Progress Array */}
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold flex items-center gap-2"><Target className="w-5 h-5 text-[#FF6B00]" /> Challenge Progress</h3>
                     <div className="text-right">
                         <span className="font-display text-4xl text-white">{group.currentXp.toLocaleString()}</span>
                         <span className="text-gray-500 font-mono text-sm"> / {group.xpGoal.toLocaleString()} XP</span>
                     </div>
                </div>
                <div className="h-4 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#2A2A2A]">
                     <div className="h-full bg-gradient-to-r from-[#FFD700] to-[#FF6B00] transition-all" style={{ width: `${progressPct}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Member Leaderboard */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-gray-300">Group Standings</h3>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
                        {group.members.map((member, idx) => (
                            <div key={member.id} className="flex items-center justify-between p-4 border-b border-[#2A2A2A] last:border-0 hover:bg-[#1A1A1A] transition-colors">
                                <div className="flex items-center gap-4">
                                     <span className={`font-mono font-bold w-6 text-center ${idx === 0 ? 'text-[#FFD700]' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-[#CD7F32]' : 'text-gray-600'}`}>{idx + 1}</span>
                                     <span className="text-2xl">{member.emoji}</span>
                                     <div className="flex flex-col">
                                         <div className="flex items-center gap-2">
                                             <span className={`font-bold ${member.name === 'You' ? 'text-white' : 'text-gray-300'}`}>{member.name}</span>
                                             {member.role === 'OWNER' && <span className="text-[10px] bg-[#FFD700]/20 text-[#FFD700] px-1.5 py-0.5 rounded font-bold">👑 OWNER</span>}
                                             {member.role === 'ADMIN' && <span className="text-[10px] bg-brand-orange/20 text-brand-yellow px-1.5 py-0.5 rounded font-bold">⭐ ADMIN</span>}
                                         </div>
                                     </div>
                                </div>
                                <span className="font-mono font-bold text-[#FF6B00]">{member.xp.toLocaleString()} XP</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Activity Feed */}
                <div className="space-y-6">
                    <h3 className="font-heading font-bold text-xl uppercase tracking-widest text-gray-300 flex items-center gap-2"><Activity className="w-5 h-5" /> Live Feed</h3>
                    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 space-y-4">
                        {group.feed.map((item, idx) => (
                            <div key={idx} className="relative pl-6 pb-4 border-l border-[#3A3A3A] last:border-0 last:pb-0">
                                <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-[#22C55E]" />
                                <div className="text-sm">
                                    <span className="font-bold text-white">{item.user}</span> <span className="text-gray-400">{item.action}</span>
                                </div>
                                <div className="flex gap-2 items-center mt-1">
                                     <span className="text-[10px] text-gray-500 font-mono">{item.time}</span>
                                     <span className="text-[10px] font-bold text-[#FFD700]">+{item.xp} XP</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
