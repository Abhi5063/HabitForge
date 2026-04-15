'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ArrowRight, Bot, Target, Clock, Activity, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePaths } from '@/hooks/usePaths';
import Link from 'next/link';

const QUICK_GOALS = ['C++ Programming', 'Python for Data Science', 'Guitar for Beginners', 'Learn Spanish', 'Get Fit', 'Read 12 Books', 'Meditation Practice', 'Learn Chess'];
const DURATIONS = [
    { value: 30, label: '1 Month', title: 'Quick Sprint', desc: 'Best for focused, specific skills' },
    { value: 90, label: '3 Months', title: 'Solid Foundation', desc: 'Most popular pacing' },
    { value: 180, label: '6 Months', title: 'Deep Mastery', desc: 'For complex academic subjects' },
    { value: 365, label: '1 Year', title: 'Life Transformation', desc: 'Long-term lifestyle goals' }
];
const LOADING_MESSAGES = [
    "🤖 Analyzing your goal...",
    "📚 Researching the best resources...",
    "🗓️ Structuring your day-by-day plan...",
    "⚡ Calculating XP rewards...",
    "🔥 Finalizing your path..."
];

// CSS Confetti Component
const CSSConfetti = () => {
    const colors = ['#FF6B00', '#FFD700', '#22C55E', '#EF4444', '#A855F7', '#00BFA5'];
    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 animate-[confetti_3s_ease-out_forwards]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-20px`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        transform: `rotate(${Math.random() * 360}deg)`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}
        </div>
    );
};

export default function NewPathPage() {
    const router = useRouter();
    const { createPath } = usePaths();
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        goal: '',
        durationDays: 90,
        dailyMinutes: 60,
        currentLevel: 'Beginner'
    });

    const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
    const [generatedPathDetail, setGeneratedPathDetail] = useState<any>(null);

    // Swap examples for UX
    const [placeholderIdx, setPlaceholderIdx] = useState(0);
    const placeholders = ['Learn C++ from scratch to intermediate level', 'Master public speaking and conquer stage fright', 'Get fit and lose 10kg with bodyweight workouts', 'Learn to play acoustic guitar confidently'];

    useEffect(() => {
        if (step === 1) {
            const int = setInterval(() => setPlaceholderIdx(i => (i + 1) % placeholders.length), 3000);
            return () => clearInterval(int);
        }
    }, [step, placeholders.length]);

    // Loading Screen Message Cycler
    useEffect(() => {
        if (step === 3) {
            const int = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 2000);
            return () => clearInterval(int);
        }
    }, [step]);

    const handleGenerate = async () => {
        setStep(3); // Start Loading
        try {
            // Initiate AI Generate via robust backend
            const created = await createPath(formData);
            setGeneratedPathDetail(created);
            // Must wait minimum 4 seconds for UX drama, even if API is fast
            setTimeout(() => setStep(4), 4000);
        } catch (err) {
            // Error handled by hook toast. Rever back visually
            setStep(2);
        }
    };

    return (
        <div className="max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center relative">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
            `}} />

            <AnimatePresence mode="wait">
                
                {/* STEP 1: What do you want to learn? */}
                {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
                        <div className="text-center space-y-4 mb-12">
                            <h1 className="text-5xl md:text-6xl font-display">What do you want to learn?</h1>
                            <p className="text-gray-400 font-mono">Describe your goal. AI will forge the perfect path.</p>
                        </div>

                        <div className="relative">
                            <textarea
                                value={formData.goal}
                                onChange={e => setFormData({...formData, goal: e.target.value.slice(0, 200)})}
                                placeholder={placeholders[placeholderIdx]}
                                className="w-full h-40 bg-[#141414] border-2 border-[#2A2A2A] focus:border-[#FFD700] rounded-3xl p-6 text-xl md:text-2xl font-bold resize-none outline-none transition-colors"
                            />
                            <div className={`absolute bottom-4 right-6 text-sm font-mono ${formData.goal.length >= 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                {formData.goal.length} / 200
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Start Templates</p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_GOALS.map(g => (
                                    <button 
                                        key={g} 
                                        onClick={() => setFormData({...formData, goal: g})}
                                        className="px-4 py-2 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] hover:bg-[#1A1A1A] hover:border-[#FFD700] hover:text-[#FFD700] text-sm font-semibold transition-all"
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-8">
                            <Button 
                                onClick={() => setStep(2)} 
                                disabled={formData.goal.length < 5}
                                className="bg-[#FFD700] hover:bg-white text-black font-bold h-14 px-10 text-lg rounded-full"
                            >
                                Continue <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: Parameters */}
                {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
                        <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400 hover:text-white mb-4 -ml-4">← Back</Button>
                        
                        <h2 className="text-4xl font-display">How long do you have?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {DURATIONS.map(d => (
                                <div 
                                    key={d.value}
                                    onClick={() => setFormData({...formData, durationDays: d.value})}
                                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${formData.durationDays === d.value ? 'bg-[#FF6B00]/10 border-[#FF6B00]' : 'bg-[#141414] border-[#2A2A2A] hover:border-gray-500'}`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-xl">{d.label}</h3>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${formData.durationDays === d.value ? 'border-[#FF6B00]' : 'border-[#3A3A3A]'}`}>
                                            {formData.durationDays === d.value && <div className="w-3 h-3 bg-[#FF6B00] rounded-full" />}
                                        </div>
                                    </div>
                                    <p className="font-bold text-[#FFD700] text-sm font-mono mb-1">{d.title}</p>
                                    <p className="text-sm text-gray-400">{d.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#141414] p-6 rounded-2xl border border-[#2A2A2A] space-y-6">
                            <div>
                                <label className="flex items-center justify-between mb-4">
                                    <span className="font-bold text-lg"><Clock className="inline w-5 h-5 mr-2 text-gray-400" /> Daily Time Commitment</span>
                                    <span className="font-mono text-[#FFD700] font-bold">{formData.dailyMinutes} mins / day</span>
                                </label>
                                <input 
                                    type="range" 
                                    min="15" 
                                    max="240" 
                                    step="15" 
                                    value={formData.dailyMinutes}
                                    onChange={e => setFormData({...formData, dailyMinutes: Number(e.target.value)})}
                                    className="w-full accent-[#FF6B00]" 
                                />
                            </div>

                            <div className="pt-4 border-t border-[#2A2A2A]">
                                <label className="font-bold text-lg mb-4 block"><Activity className="inline w-5 h-5 mr-2 text-gray-400" /> Current Experience Level</label>
                                <div className="flex gap-4">
                                    {['Beginner', 'Some Experience', 'Intermediate'].map(lvl => (
                                        <button 
                                            key={lvl}
                                            onClick={() => setFormData({...formData, currentLevel: lvl})}
                                            className={`flex-1 py-3 rounded-lg border transition-colors ${formData.currentLevel === lvl ? 'bg-white text-black border-white font-bold' : 'bg-[#0A0A0A] border-[#3A3A3A] text-gray-400 hover:border-gray-500'}`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button 
                                onClick={handleGenerate} 
                                className="bg-[#FF6B00] hover:bg-orange-500 text-white font-bold h-14 px-10 text-lg rounded-full w-full md:w-auto"
                            >
                                <Bot className="w-5 h-5 mr-2" /> Generate Path Matrix
                            </Button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: Loading Screen (Full Overlay via motion) */}
                {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="relative w-48 h-48 flex items-center justify-center mb-12">
                             <div className="absolute inset-0 border-t-4 border-r-4 border-[#FF6B00] rounded-full opacity-30" />
                             <div className="absolute inset-4 border-b-4 border-l-4 border-[#FFD700] rounded-full opacity-60" />
                             <Bot className="w-16 h-16 text-white" />
                        </motion.div>
                        
                        <div className="h-12 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.h2 
                                    key={loadingMsgIdx} 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }} 
                                    className="text-2xl font-bold font-mono text-center text-[#FFD700]"
                                >
                                    {LOADING_MESSAGES[loadingMsgIdx]}
                                </motion.h2>
                            </AnimatePresence>
                        </div>

                        <p className="mt-8 text-gray-500 text-sm max-w-sm text-center">
                            <strong className="text-gray-300">Tip:</strong> Paths are saved forever. You can abandon or pause them at any time if they become too overwhelming.
                        </p>
                    </motion.div>
                )}

                {/* STEP 4: Success Celebration */}
                {step === 4 && generatedPathDetail && (
                    <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-10 relative">
                        <CSSConfetti />
                        
                        <div className="w-24 h-24 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12 text-[#22C55E]" />
                        </div>

                        <h1 className="text-5xl font-display text-white">YOUR PATH IS READY!</h1>
                        <h2 className="text-xl font-heading text-[#FFD700] font-bold">"{generatedPathDetail.title}"</h2>
                        
                        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 max-w-lg mx-auto text-left">
                            <h3 className="font-bold text-gray-400 uppercase tracking-widest text-xs mb-4">First 3 Days Preview</h3>
                            <div className="space-y-3">
                                {generatedPathDetail.plan?.slice(0, 3).map((task: any) => (
                                    <div key={task.id} className="flex gap-4 p-3 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]">
                                        <div className="font-mono font-bold text-[#FF6B00]">D{task.dayNumber}</div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{task.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[250px]">{task.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                           <p className="text-gray-400 mb-6 font-mono">Completion yields <strong className="text-[#FFD700] text-xl">{(generatedPathDetail.plan?.length || 0) * 150} XP</strong></p>
                           <Link href={`/paths/${generatedPathDetail.id}`}>
                               <Button className="bg-[#22C55E] hover:bg-green-400 text-black font-bold h-16 w-full max-w-sm text-xl rounded-full animate-bounce hover:animate-none">
                                   START DAY 1
                               </Button>
                           </Link>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}
