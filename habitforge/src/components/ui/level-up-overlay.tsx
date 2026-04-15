'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Confetti } from './confetti';

interface Props {
    active: boolean;
    level: number;
    onComplete?: () => void;
}

export function LevelUpOverlay({ active, level, onComplete }: Props) {
    return (
        <AnimatePresence onExitComplete={onComplete}>
             {active && (
                 <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.5 }}
                     className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
                 >
                     <Confetti active={true} />
                     
                     <motion.div
                         initial={{ scale: 0.5, y: 50 }}
                         animate={{ scale: 1, y: 0 }}
                         exit={{ scale: 0.5, y: -50, opacity: 0 }}
                         transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                         className="flex flex-col items-center"
                     >
                          <div className="w-32 h-32 bg-[#1A1A1A] border-4 border-[#FFD700] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(255,215,0,0.5)]">
                              <span className="text-6xl">⚡</span>
                          </div>
                          
                          <h1 className="font-display text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FF6B00] mb-2 tracking-widest text-center filter drop-shadow-[0_0_10px_rgba(255,107,0,0.8)]">LEVEL UP</h1>
                          
                          <p className="font-mono text-xl text-gray-300 font-bold tracking-widest">YOU REACHED LEVEL <span className="text-[#22C55E]">{level}</span>!</p>
                     </motion.div>
                 </motion.div>
             )}
        </AnimatePresence>
    );
}
