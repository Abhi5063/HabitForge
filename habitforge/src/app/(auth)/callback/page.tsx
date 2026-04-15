'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

function CallbackLogic() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const setAuth = useAuthStore(s => s.setAuth);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Assume the backend generated this temporary token. We use it to fetch the actual user, 
            // and the backend set a refresh cookie automatically.
            
            // Temporary set to allow Axios to authorize the /me call
            useAuthStore.getState().setAuth({} as any, token);

            api.auth.me().then(res => {
                setAuth(res.data, token);
                router.push('/dashboard');
            }).catch(() => {
                router.push('/login?error=OAuthFailed');
            });
        } else {
            router.push('/login');
        }
    }, [searchParams, router, setAuth]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[#0A0A0A]">
            <Loader2 className="w-12 h-12 text-[#FF6B00] animate-spin" />
            <h1 className="font-display text-2xl tracking-widest text-[#FFD700]">AUTHENTICATING...</h1>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
            <CallbackLogic />
        </Suspense>
    );
}
