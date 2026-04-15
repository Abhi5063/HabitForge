'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Users, Target, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateGroupModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [xpGoal, setXpGoal] = useState(50000);
    const [isPrivate, setIsPrivate] = useState(false);

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity animate-in fade-in" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] bg-[#141414] border border-[#2A2A2A] shadow-2xl p-6 md:rounded-3xl animate-in zoom-in-95 duration-200">
                    
                    <div className="flex justify-between items-center border-b border-[#2A2A2A] pb-4 mb-6">
                        <h2 className="text-2xl font-heading font-bold flex items-center gap-2"><Users className="w-5 h-5 text-[#FFD700]" /> Forge a Group</h2>
                        <Dialog.Close asChild>
                            <button className="rounded-full w-8 h-8 flex items-center justify-center bg-[#1A1A1A] text-gray-500 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] border border-[#2A2A2A] flex items-center justify-center text-3xl cursor-pointer hover:border-[#FFD700] transition-colors flex-shrink-0">
                                🏳️‍🌈
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Group Name</label>
                                <Input placeholder="e.g. Iron Forgers" className="bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FFD700] font-bold h-11" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
                            <textarea 
                                placeholder="What is the goal of this guild?" 
                                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl p-3 text-sm focus:border-[#FFD700] outline-none min-h-[80px]"
                            />
                        </div>

                        <div className="bg-[#0A0A0A] p-5 rounded-2xl border border-[#2A2A2A] space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-400" />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm">Private Group</span>
                                        <span className="text-xs text-gray-500">Require invites to join</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsPrivate(!isPrivate)}
                                    className={`w-12 h-6 rounded-full relative transition-colors ${isPrivate ? 'bg-[#FFD700]' : 'bg-[#2A2A2A]'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isPrivate ? 'translate-x-7' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="pt-4 border-t border-[#2A2A2A]">
                                <label className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-sm flex items-center gap-2"><Target className="w-4 h-4 text-gray-400" /> Collective XP Goal</span>
                                    <span className="font-mono text-[#FFD700] font-bold">{xpGoal.toLocaleString()} XP</span>
                                </label>
                                <input 
                                    type="range" min="1000" max="100000" step="1000" 
                                    value={xpGoal}
                                    onChange={e => setXpGoal(Number(e.target.value))}
                                    className="w-full h-2 bg-[#2A2A2A] rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
                                />
                                <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-2">
                                    <span>1k</span><span>100k</span>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-[#FFD700] text-black hover:bg-white font-bold h-12 text-lg">
                            Create Challenge
                        </Button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
