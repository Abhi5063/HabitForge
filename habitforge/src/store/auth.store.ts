import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    avatarEmoji: string;
    totalXP: number;
    currentLevel: number;
    longestStreak: number;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
            clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
            updateUser: (updates) => set((state) => ({ 
                user: state.user ? { ...state.user, ...updates } : null 
            }))
        }),
        {
            name: 'habitforge-auth'
        }
    )
);
