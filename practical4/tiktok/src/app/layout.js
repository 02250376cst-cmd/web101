import { Geist } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';
import MainLayout from '@/components/layout/MainLayout';
import { Toaster } from 'react-hot-toast';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'TikTok Clone',
  description: 'A TikTok clone built with Next.js and Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}