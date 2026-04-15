'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Brain, Trophy, User, Plus } from 'lucide-react';
import { CreateHabitModal } from '@/components/habits/create-habit-modal';
import { useState } from 'react';

export function MobileNav() {
    const pathname = usePathname();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const links = [
        { href: '/dashboard', icon: LayoutDashboard },
        { href: '/habits', icon: CheckSquare },
        { href: 'FAB', icon: Plus }, // Placeholder for FAB
        { href: '/paths', icon: Brain },
        { href: '/social', icon: Trophy },
    ];

    return (
        <>
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#141414] border-t border-[#2A2A2A] z-40 md:hidden flex items-center justify-around px-2 pb-safe">
            {links.map((link, idx) => {
                if (link.href === 'FAB') {
                    return (
                        <button 
                            key="fab" 
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-[#FF6B00] w-14 h-14 rounded-full flex items-center justify-center -translate-y-4 shadow-[0_0_20px_rgba(255,107,0,0.4)] border-4 border-[#0A0A0A] text-black hover:scale-110 transition-transform"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    );
                }

                const isActive = pathname.startsWith(link.href);
                return (
                    <Link 
                        key={link.href} 
                        href={link.href} 
                        className={`w-12 h-12 flex flex-col items-center justify-center relative transition-colors ${isActive ? 'text-[#FF6B00]' : 'text-gray-500 hover:text-white'}`}
                    >
                        <link.icon className="w-6 h-6" />
                        {isActive && <div className="absolute bottom-1 w-1 h-1 bg-[#FF6B00] rounded-full" />}
                    </Link>
                );
            })}
        </div>

        <CreateHabitModal 
            open={isCreateOpen} 
            onOpenChange={setIsCreateOpen} 
            onSubmit={(d) => console.log('Create Habit Desktop Delegated', d)} 
        />
        </>
    );
}
