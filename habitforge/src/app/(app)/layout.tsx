'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { TopBar } from '@/components/layout/top-bar';
import { useStreakProtection } from '@/hooks/useStreakProtection';
import { Loader2 } from 'lucide-react';

function AppGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, isLoading } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useStreakProtection(); // Mounts silently to guard local system clocks

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isLoading && !isAuthenticated) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
    }, [mounted, isAuthenticated, isLoading, pathname, router]);

    if (!mounted || isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex">
            {/* Desktop Navigation */}
            <Sidebar />

            <div className="flex-1 flex flex-col md:pl-64 overflow-hidden relative">
                {/* Global Mobile Top / Desktop Top Header Bound Elements */}
                <TopBar />
                
                {/* Scrollable Main Views */}
                <main className="flex-1 overflow-y-auto pb-24 md:pb-8 p-4 md:p-8 custom-scrollbar relative">
                    {children}
                </main>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
        </div>
    );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]"><div className="w-full h-1 bg-[#FF6B00] animate-pulse" /></div>}>
            <AppGuard>{children}</AppGuard>
        </Suspense>
    );
}
