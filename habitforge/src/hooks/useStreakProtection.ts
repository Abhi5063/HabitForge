'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useStreakProtection() {
    const [hasAlerted, setHasAlerted] = useState(false);

    useEffect(() => {
        // Guard checking if the user actively has habits uncompleted towards late day schedules.
        // We run a sweeping interval looking tracking local time offsets securely.
        
        const checkTime = () => {
            const now = new Date();
            // 8 PM check (20:00)
            if (now.getHours() >= 20 && !hasAlerted) {
                // In a real application, check the React Query cache or Zustand store here
                // For demonstration, simulating risk
                const hasPendingHabits = true; 
                
                if (hasPendingHabits) {
                    toast.error('⚠️ Streak at risk! Complete your habits before midnight!', {
                        duration: 10000,
                        icon: '🔥',
                        style: {
                            border: '1px solid #FF6B00',
                            padding: '16px',
                            color: '#FFD700',
                            background: '#141414',
                        },
                    });
                    setHasAlerted(true);
                }
            }
        };

        const interval = setInterval(checkTime, 60 * 1000); // Check every minute explicitly
        checkTime(); // Initial mount run

        return () => clearInterval(interval);
    }, [hasAlerted]);

    return null; // Silent logic hook
}
