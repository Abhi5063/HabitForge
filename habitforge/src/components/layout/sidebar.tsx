'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Brain, BarChart2, Trophy, Timer, Settings, Flame, Navigation, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';

export function Sidebar() {
    const pathname = usePathname();
    const { user, clearAuth } = useAuthStore();

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/habits', label: 'Habits', icon: CheckSquare },
        { href: '/paths', label: 'AI Paths', icon: Brain },
        { href: '/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/social', label: 'Social', icon: Trophy },
        { href: '/focus', label: 'Focus Timer', icon: Timer },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = () => {
        clearAuth();
        window.location.href = '/login';
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#141414] border-r border-[#2A2A2A] flex flex-col z-40 hidden md:flex">
            {/* Header */}
            <div className="h-20 flex items-center px-6 border-b border-[#2A2A2A]">
                <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-display tracking-widest text-white hover:text-[#FFD700] transition-colors">
                    <Flame className="w-8 h-8 text-[#FF6B00]" />
                    HABITFORGE
                </Link>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                {links.map(link => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link 
                            key={link.href} 
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${isActive ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'text-gray-400 hover:text-white hover:bg-[#1A1A1A]'}`}
                        >
                            <link.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            {/* Footer / Profile */}
            <div className="p-4 border-t border-[#2A2A2A] bg-[#0A0A0A]">
                {user ? (
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-transparent hover:border-[#3A3A3A]">
                        <div className="w-10 h-10 rounded-full bg-[#141414] border border-[#3A3A3A] flex items-center justify-center text-xl">{user.avatarEmoji}</div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                             <span className="font-bold text-sm text-white truncate">{user.displayName}</span>
                             <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider">Lvl {user.currentLevel}</span>
                                 <div className="flex-1 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                                     <div className="h-full bg-[#FFD700]" style={{ width: '45%' }} />
                                 </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 text-center">
                        <Loader2 className="w-5 h-5 animate-spin text-[#FF6B00] mx-auto" />
                    </div>
                )}
                
                <Button variant="ghost" onClick={handleLogout} className="w-full text-gray-500 hover:text-red-500 hover:bg-red-500/10 justify-start h-10 px-4 font-bold text-xs">
                    <LogOut className="w-4 h-4 mr-2" /> DISCONNECT
                </Button>
            </div>
        </aside>
    );
}

// Temporary internal component resolving strict TS block on unimported Loader2 gracefully
import { Loader2 } from 'lucide-react';
