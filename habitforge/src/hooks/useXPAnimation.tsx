'use client';

import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

function FloatingXP({ amount, x, y, onComplete }: { amount: number, x: number, y: number, onComplete: () => void }) {
    return (
        <AnimatePresence onExitComplete={onComplete}>
            <motion.div
                initial={{ opacity: 0, y, x, scale: 0.5 }}
                animate={{ opacity: 1, y: y - 100, scale: 1.5 }}
                exit={{ opacity: 0, y: y - 150 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="fixed z-[9999] pointer-events-none font-display text-4xl text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] whitespace-nowrap"
            >
                +{amount} XP
            </motion.div>
        </AnimatePresence>
    );
}

export function useXPAnimation() {
    const triggerXPAnimation = (amount: number, e?: React.MouseEvent) => {
        // Fallback to center if no mouse event orchestrator mapped
        let startX = window.innerWidth / 2;
        let startY = window.innerHeight / 2;

        if (e) {
            startX = e.clientX;
            startY = e.clientY;
        }

        const container = document.createElement('div');
        document.body.appendChild(container);
        const root = createRoot(container);

        const cleanup = () => {
            setTimeout(() => {
                root.unmount();
                container.remove();
            }, 500); // Pad out the exit animation cleanly
        };

        root.render(<FloatingXP amount={amount} x={startX} y={startY} onComplete={cleanup} />);
    };

    return { triggerXPAnimation };
}
