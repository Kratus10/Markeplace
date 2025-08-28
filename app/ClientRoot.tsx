'use client';

import { SessionProvider } from 'next-auth/react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Navigation />
      <main className="flex-grow min-h-[calc(100vh-140px)]">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
}
