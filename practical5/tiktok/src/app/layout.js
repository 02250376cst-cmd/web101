'use client';
import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const geist = Geist({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <html lang="en">
      <body className={geist.className}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster position="top-center" />
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}