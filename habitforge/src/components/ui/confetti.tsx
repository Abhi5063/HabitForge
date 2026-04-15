'use client';

import { useEffect, useState } from 'react';

// Using pure CSS keyframes natively injected ensuring we bypass heavy 3rd-party canvas rendering logic!
const CONFETTI_COLORS = ['#FF6B00', '#FFD700', '#22C55E', '#FFFFFF'];

export function Confetti({ active }: { active: boolean }) {
    const [pieces, setPieces] = useState<any[]>([]);

    useEffect(() => {
        if (active) {
            // Generate 20 optimized squares mapping arbitrary DOM parameters across bounds natively.
            const arr = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                left: Math.random() * 100, // percentage string
                animationDelay: Math.random() * 0.5, // stagger offset
                color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
                size: Math.random() * 8 + 4, // 4px to 12px natively
                tilt: Math.random() * 360,
                duration: Math.random() * 2 + 1.5,
            }));
            setPieces(arr);

            const timer = setTimeout(() => {
                setPieces([]);
            }, 5000); // Expose pure silent cleanup
            
            return () => clearTimeout(timer);
        } else {
            setPieces([]);
        }
    }, [active]);

    if (!active || pieces.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {pieces.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-[-5%]"
                    style={{
                        left: `${p.left}%`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: p.color,
                        transform: `rotate(${p.tilt}deg)`,
                        animation: `confetti-fall ${p.duration}s ease-in forwards ${p.animationDelay}s`,
                    }}
                />
            ))}
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes confetti-fall {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
                }
            `}} />
        </div>
    );
}
