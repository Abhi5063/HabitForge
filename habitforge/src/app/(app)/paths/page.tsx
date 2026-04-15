'use client';

import { useState } from 'react';
import { Bot, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePaths } from '@/hooks/usePaths';
import { PathCard } from '@/components/paths/path-card';

type TabType = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export default function PathsPage() {
    const { paths, isLoading } = usePaths();
    const [tab, setTab] = useState<TabType>('ACTIVE');

    const filteredPaths = paths.filter((p: any) => tab === 'ACTIVE' ? p.status === 'ACTIVE' : p.status === tab);

    return (
        <div className="max-w-7xl mx-auto space-y-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#141414] border border-[#2A2A2A] rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute right-[-5%] top-[-20%] opacity-5 pointer-events-none">
                    <Bot className="w-96 h-96 text-[#FFD700]" />
                </div>
                
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-display tracking-wide mb-2">AI LEARNING PATHS</h1>
                    <p className="text-gray-400 font-mono text-sm max-w-md">
                        Describe what you want to achieve, and Gemini will build a step-by-step curriculum customized specifically to your lifestyle and limits.
                    </p>
                </div>

                <div className="relative z-10">
                    <Link href="/paths/new">
                        <Button className="bg-gradient-to-r from-[#FF6B00] to-[#FFD700] hover:from-[#FFD700] hover:to-[#FF6B00] text-black font-bold h-14 px-8 text-lg rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all hover:scale-105">
                            <Plus className="w-5 h-5 mr-2" /> Create New Quest
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#2A2A2A]">
                {(['ACTIVE', 'PAUSED', 'COMPLETED'] as TabType[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`relative px-6 py-4 text-sm font-bold tracking-wider uppercase transition-colors ${tab === t ? 'text-[#FFD700]' : 'text-gray-500 hover:text-white'}`}
                    >
                        {t}
                        {tab === t && (
                            <motion.div layoutId="path-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFD700] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" /></div>
            ) : filteredPaths.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredPaths.map((path: any) => (
                            <motion.div 
                                key={path.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <PathCard path={path} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="text-center p-20 border border-dashed border-[#2A2A2A] rounded-3xl bg-[#0A0A0A]">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                    <h3 className="text-2xl font-heading font-bold mb-2">No {tab.toLowerCase()} paths</h3>
                    <p className="text-gray-400">Generate a custom AI roadmap to start mastering a new skill.</p>
                </div>
            )}
        </div>
    );
}
