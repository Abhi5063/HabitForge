'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';
import { HabitCard } from '@/components/habits/habit-card';
import { CreateHabitModal } from '@/components/habits/create-habit-modal';
import { HabitDetailSheet } from '@/components/habits/habit-detail-sheet';

type FilterType = 'ALL' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ARCHIVED';

export default function HabitsPage() {
    const { habits, isLoading, createHabit, updateHabit, completeHabit, deleteHabit } = useHabits();
    
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);

    // Derived states
    const selectedHabit = habits.find((h: any) => h.id === selectedHabitId) || null;

    const filteredHabits = habits.filter((h: any) => {
        // Filter logic
        if (filter === 'ARCHIVED') {
            if (!h.isArchived) return false;
        } else {
            if (h.isArchived) return false;
            if (filter !== 'ALL' && h.frequency !== filter) return false;
        }

        // Search logic
        if (searchQuery && !h.title.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    }).sort((a: any, b: any) => b.currentStreak - a.currentStreak);

    const handleCreateSubmit = (data: any) => {
        if (editMode && selectedHabitId) {
            updateHabit({ id: selectedHabitId, data });
        } else {
            createHabit(data);
        }
    };

    const handleOpenCreate = () => {
        setEditMode(false);
        setSelectedHabitId(null);
        setIsCreateOpen(true);
    };

    const handleOpenEdit = (habit: any) => {
        setEditMode(true);
        setSelectedHabitId(habit.id);
        setIsCreateOpen(true);
    };

    const handleOpenDetail = (id: string) => {
        setSelectedHabitId(id);
        setIsDetailOpen(true);
    };

    const handleToggleArchive = (id: string, isArchived: boolean) => {
        updateHabit({ id, data: { isArchived: !isArchived } });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-display tracking-wide mb-1">YOUR HABITS</h1>
                    <p className="text-gray-400 font-mono text-sm">Forge routines, track progress, earn XP.</p>
                </div>
                <Button onClick={handleOpenCreate} className="bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black font-bold h-12 px-6">
                    <Plus className="w-5 h-5 mr-2" /> New Habit
                </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#141414] p-4 rounded-2xl border border-[#2A2A2A]">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {(['ALL', 'DAILY', 'WEEKLY', 'MONTHLY', 'ARCHIVED'] as FilterType[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-colors ${filter === f ? 'bg-[#FF6B00] text-white' : 'bg-[#0A0A0A] text-gray-500 border border-[#2A2A2A] hover:text-white'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input 
                        placeholder="Search habits..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-9 bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FF6B00] h-10 w-full"
                    />
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B00]" /></div>
            ) : filteredHabits.length > 0 ? (
                <motion.div 
                    layout
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    <AnimatePresence>
                        {filteredHabits.map((h: any) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                key={h.id}
                            >
                                <HabitCard 
                                    habit={h}
                                    onComplete={completeHabit}
                                    onEdit={handleOpenEdit}
                                    onArchive={handleToggleArchive}
                                    onDelete={deleteHabit}
                                    onViewDetail={handleOpenDetail}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="text-center p-20 border-2 border-dashed border-[#2A2A2A] rounded-3xl bg-[#141414]">
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] mx-auto flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-2">No habits found</h3>
                    <p className="text-gray-400">Try adjusting your filters or create a new habit.</p>
                </div>
            )}

            {/* Modals */}
            <CreateHabitModal 
                open={isCreateOpen} 
                onOpenChange={setIsCreateOpen} 
                onSubmit={handleCreateSubmit}
                initialData={editMode ? selectedHabit : null}
            />

            <HabitDetailSheet 
                open={isDetailOpen}
                onOpenChange={setIsDetailOpen}
                habit={selectedHabit}
                onEdit={handleOpenEdit}
                onArchive={handleToggleArchive}
            />

        </div>
    );
}
