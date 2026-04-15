'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Calendar, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const CATEGORIES = ['Health', 'Learning', 'Fitness', 'Finance', 'Mindfulness', 'Productivity', 'Social', 'Creative', 'Other'];
const FREQUENCIES = ['DAILY', 'WEEKLY', 'MONTHLY'];
// Replaced blue with teal as instructed
const COLORS = ['#FF6B00', '#FFD700', '#22C55E', '#EF4444', '#A855F7', '#00BFA5', '#F43F5E', '#64748B'];
// Limited preset of emojis for the UI matching constraints
const EMOJIS = ['🏃', '📚', '💪', '💰', '🧘', '💻', '🤝', '🎨', '🔥', '💧', '🥗', '⚡'];

export function CreateHabitModal({ open, onOpenChange, onSubmit, initialData }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category || 'Productivity',
      frequency: initialData?.frequency || 'DAILY',
      icon: initialData?.icon || '🔥',
      color: initialData?.color || '#FF6B00'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSave = () => {
      onSubmit(formData);
      onOpenChange(false);
      setTimeout(() => setStep(1), 300); // reset on close
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(() => setStep(1), 300); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 bg-[#141414] border border-[#2A2A2A] shadow-2xl p-6 md:rounded-3xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] h-[100dvh] md:h-auto overflow-y-auto">
            
            <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[#FF6B00]' : i < step ? 'w-3 bg-[#FF6B00]/50' : 'w-3 bg-[#2A2A2A]'}`} />
                    ))}
                </div>
                <Dialog.Close asChild>
                    <button className="rounded-full p-2 hover:bg-[#1A1A1A] text-gray-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </Dialog.Close>
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-heading font-bold">What are you forging?</h2>
                            <div>
                                <Input 
                                    placeholder="Habit Title (e.g. Morning Run)" 
                                    value={formData.title} 
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="h-14 text-xl font-bold bg-[#0A0A0A] border-[#2A2A2A] focus:border-[#FF6B00]" 
                                    autoFocus
                                />
                            </div>
                            <div>
                                <textarea 
                                    placeholder="Optional description or motivation..." 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-sm focus:border-[#FF6B00] outline-none min-h-[80px]"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button 
                                            key={cat} 
                                            onClick={() => setFormData({...formData, category: cat})}
                                            className={`px-3 py-1.5 rounded-full text-sm font-mono transition-colors ${formData.category === cat ? 'bg-[#FFD700] text-black font-bold' : 'bg-[#1A1A1A] text-gray-400 border border-[#2A2A2A] hover:bg-[#2A2A2A]'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-heading font-bold">Set your rhythm</h2>
                            <div className="grid gap-3">
                                {FREQUENCIES.map(freq => (
                                    <button 
                                        key={freq}
                                        onClick={() => setFormData({...formData, frequency: freq})}
                                        className={`flex items-center p-4 rounded-xl border text-left transition-all ${formData.frequency === freq ? 'bg-[#FF6B00]/10 border-[#FF6B00]' : 'bg-[#0A0A0A] border-[#2A2A2A] hover:border-gray-500'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${formData.frequency === freq ? 'border-[#FF6B00]' : 'border-gray-600'}`}>
                                            {formData.frequency === freq && <div className="w-3 h-3 bg-[#FF6B00] rounded-full" />}
                                        </div>
                                        <div>
                                            <div className="font-bold">{freq}</div>
                                            <div className="text-xs text-gray-400 font-mono mt-1">
                                                {freq === 'DAILY' ? 'Every single day.' : freq === 'WEEKLY' ? 'Complete multiple times a week.' : 'Long-term monthly goal.'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="s3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-heading font-bold">Customize your identity</h2>
                            
                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Brand Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {COLORS.map(color => (
                                        <button 
                                            key={color}
                                            onClick={() => setFormData({...formData, color})}
                                            className={`w-10 h-10 rounded-full transition-transform ${formData.color === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#141414]' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-400 mb-2 block">Choose Icon</label>
                                <div className="grid grid-cols-6 gap-2 bg-[#0A0A0A] p-4 rounded-xl border border-[#2A2A2A] h-[200px] overflow-y-auto">
                                    {EMOJIS.map(emoji => (
                                        <button 
                                            key={emoji}
                                            onClick={() => setFormData({...formData, icon: emoji})}
                                            className={`text-2xl p-2 rounded-lg transition-colors ${formData.icon === emoji ? 'bg-[#2A2A2A]' : 'hover:bg-[#1A1A1A]'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                         <motion.div key="s4" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-heading font-bold text-center">Ready to Forge?</h2>
                            
                            <div className="w-full max-w-sm mx-auto p-5 rounded-2xl border bg-[#0A0A0A]" style={{ borderColor: `${formData.color}40` }}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: `${formData.color}20` }}>
                                        {formData.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">{formData.title || 'Untitled Habit'}</h3>
                                        <p className="text-xs text-gray-400 mt-1 font-mono uppercase">{formData.frequency} • {formData.category}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-[#141414] rounded-lg p-3 border border-[#2A2A2A]">
                                    <span className="text-xs text-gray-400">XP per completion</span>
                                    <span className="font-bold text-[#FFD700]">+{formData.frequency === 'DAILY' ? 50 : 150} XP</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-[#2A2A2A]">
                {step > 1 ? (
                    <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white hover:bg-[#1A1A1A]">Back</Button>
                ) : <div />}
                
                {step < 4 ? (
                    <Button onClick={handleNext} disabled={step === 1 && !formData.title.trim()} className="bg-white text-black hover:bg-gray-200 min-w-[100px] font-bold">
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSave} className="bg-[#FF6B00] hover:bg-[#FFD700] hover:text-black text-white min-w-[120px] font-bold">
                        <Save className="w-4 h-4 mr-2" /> Save Form
                    </Button>
                )}
            </div>
            
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
