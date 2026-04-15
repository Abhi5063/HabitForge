'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MOCK_NOTIFS = [
    { id: 1, type: 'BADGE_UNLOCK', message: "You unlocked 'Week Warrior'!", time: '2m ago', icon: '🏅', color: '#FFD700' },
    { id: 2, type: 'LEVEL_UP', message: "Level Up! You reached Level 8!", time: '1h ago', icon: '⚡', color: '#FF6B00' },
    { id: 3, type: 'STREAK_REMINDER', message: "Don't break your streak! Complete [Morning Run]", time: '3h ago', icon: '🔥', color: '#FF6B00' },
    { id: 4, type: 'FRIEND_REQUEST', message: "Sofia Reyes sent you a friend request", time: '1d ago', icon: '🤝', color: '#22C55E' },
    { id: 5, type: 'GROUP_INVITE', message: "You've been invited to '30 Days of Code'", time: '2d ago', icon: '👥', color: '#FFD700' }
];

export function NotificationsPanel({ open, onOpenChange }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-[#0A0A0A] border-l border-[#2A2A2A] shadow-2xl overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
            
            <div className="sticky top-0 z-10 bg-[#0A0A0A]/90 backdrop-blur pb-4 border-b border-[#2A2A2A]">
                <div className="flex justify-between items-center p-6">
                    <h2 className="text-xl font-heading font-bold uppercase tracking-widest text-white">SYSTEM ALERTS</h2>
                    <Dialog.Close asChild>
                        <button className="rounded-full w-8 h-8 flex items-center justify-center bg-[#141414] hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors border border-[#2A2A2A]">
                            <X className="w-4 h-4" />
                        </button>
                    </Dialog.Close>
                </div>
                <div className="px-6 flex justify-end">
                    <button className="text-[10px] uppercase font-bold tracking-wider text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                        <Check className="w-3 h-3" /> Mark all as read
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {MOCK_NOTIFS.map(n => (
                    <div key={n.id} className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-4 flex gap-4 items-start relative overflow-hidden group hover:border-gray-500 transition-colors">
                        <div className="absolute left-0 top-0 bottom-0 w-1 opacity-50" style={{ backgroundColor: n.color }} />
                        <div className="text-2xl mt-1 filter drop-shadow-md">{n.icon}</div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-gray-200 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] font-mono text-gray-500 mt-2 block">{n.time}</span>
                        </div>
                    </div>
                ))}
            </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
