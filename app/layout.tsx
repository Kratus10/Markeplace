import '../styles/globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SessionProviderWrapper from '@/app/providers/SessionProviderWrapper';
import DefaultSeoHead from '@/components/seo/DefaultSeoHead';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <DefaultSeoHead />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
