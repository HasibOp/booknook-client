'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import FlashToast from '@/components/ui/FlashToast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion='user'>{children}</MotionConfig>
      <FlashToast />
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 3500,
          className:
            'bg-base-100! text-base-content! rounded-2xl! shadow-lg! border border-base-300',
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--color-base-100)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-error)',
              secondary: 'var(--color-base-100)',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}
