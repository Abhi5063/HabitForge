'use client';

import { Bell, Flame } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { NotificationsPanel } from './notifications-panel';
import { useState } from 'react';

export function TopBar() {
    const { user } = useAuthStore();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 w-full h-16 bg-[#141414]/90 backdrop-blur-md border-b border-[#2A2A2A] flex items-center justify-between px-4 md:px-8">
             {/* Mobile Logo Left Boundary */}
             <div className="md:hidden flex items-center gap-2 text-xl font-display tracking-widest text-white">
                  <Flame className="w-6 h-6 text-[#FF6B00]" />
                  HABITFORGE
             </div>

             {/* Desktop Left Bounds (Empty or dynamic path tracking could go here later) */}
             <div className="hidden md:flex"></div>

             {/* Right Bounds */}
             <div className="flex items-center gap-4">
                 <button onClick={() => setIsNotifOpen(true)} className="relative p-2 text-gray-400 hover:text-white transition-colors">
                     <Bell className="w-5 h-5" />
                     {/* Unread dot simulation */}
                     <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B00] border border-[#141414] rounded-full" />
                 </button>

                 <div className="hidden md:flex items-center gap-2 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-1.5 rounded-full">
                     <Flame className="w-4 h-4 text-[#FFD700]" />
                     <span className="text-sm font-mono font-bold text-[#FFD700]">{user?.totalXP?.toLocaleString() || 0} XP</span>
                 </div>
                 
                 <div className="md:hidden w-8 h-8 rounded-full border border-[#3A3A3A] bg-[#0A0A0A] flex items-center justify-center text-sm">
                     {user?.avatarEmoji || '👤'}
                 </div>
             </div>

             <NotificationsPanel open={isNotifOpen} onOpenChange={setIsNotifOpen} />
        </header>
    );
}
