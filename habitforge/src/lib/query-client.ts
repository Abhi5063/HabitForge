import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 30 * 60 * 1000,   // 30 minutes
            retry: 2,
            refetchOnWindowFocus: true
        },
        mutations: {
            onError: (err: any) => {
                // Default error handler
                if (err?.response?.status >= 500) {
                    toast.error('System Error. The Forge is currently unstable.');
                }
            }
        }
    }
});
