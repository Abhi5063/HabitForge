'use client';

import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';

// This acts very similarly to our internal hook, but exposes a purely functional UI container securely!
interface Props {
    amount: number;
    x: number;
    y: number;
    onComplete: () => void;
}

export function XPPopup({ amount, x, y, onComplete }: Props) {
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

// Utility wrapper allowing declarative execution from any component natively.
export function triggerXP(amount: number, clientX: number, clientY: number) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    const cleanup = () => {
        setTimeout(() => {
            root.unmount();
            container.remove();
        }, 500); 
    };

    root.render(<XPPopup amount={amount} x={clientX} y={clientY} onComplete={cleanup} />);
}
