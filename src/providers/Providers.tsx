"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

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
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          className: "!bg-base-100 !text-base-content !rounded-2xl !shadow-lg border border-base-300",
          success: { iconTheme: { primary: "var(--color-success)", secondary: "var(--color-base-100)" } },
          error: { iconTheme: { primary: "var(--color-error)", secondary: "var(--color-base-100)" } },
        }}
      />
    </QueryClientProvider>
  );
}
