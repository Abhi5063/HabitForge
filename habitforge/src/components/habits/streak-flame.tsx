'use client';

interface Props {
    streak: number;
    className?: string;
}

export function StreakFlame({ streak, className = '' }: Props) {
    // We compute simple deterministic intensity scales avoiding logic breaks 
    const isBlazing = streak >= 30;
    const scale = Math.min(1.5, Math.max(0.8, 0.8 + (streak / 50)));

    return (
        <div 
            className={`relative flex items-center justify-center ${className}`}
            style={{ transform: `scale(${scale})` }}
            title={`${streak} Day Streak`}
        >
            <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`w-6 h-6 z-10 transition-colors ${streak > 0 ? (isBlazing ? 'text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-[#FF6B00] drop-shadow-[0_0_5px_rgba(255,107,0,0.6)]') : 'text-gray-600'}`}
            >
                <path d="M12 2c0 0-4.5 4.5-4.5 9.5 0 2 1 3 2 4.5-1.5-1-2.5-3-2.5-5.5 0 0-3 3-3 6 0 4.5 3.5 8 8 8s8-3.5 8-8c0-3-3-6-3-6 0 2.5-1 4.5-2.5 5.5 1-1.5 2-2.5 2-4.5 0-5-4.5-9.5-4.5-9.5z" />
            </svg>
            
            {/* Pulsing CSS Halo behind active flames strictly */}
            {streak > 0 && (
                <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
                    style={{ backgroundColor: isBlazing ? '#FFD700' : '#FF6B00' }}
                />
            )}
        </div>
    );
}
