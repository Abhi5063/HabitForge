'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster 
          position="top-right" 
          toastOptions={{ 
              style: { background: '#141414', color: '#fff', border: '1px solid #2A2A2A' },
              success: { iconTheme: { primary: '#22C55E', secondary: '#141414' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#141414' } }
          }} 
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
