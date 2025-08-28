'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Header session state:', { session, status });
  }, [session, status]);

  const navLinks = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/hire', label: 'Hire a Developer' },
    { href: '/forum', label: 'Forum' },
    { href: '/signals', label: 'Signals' },
  ];

  const [sessionChecked, setSessionChecked] = useState(false);

  // Additional session check on component mount
  useEffect(() => {
    if (status === 'authenticated' && !sessionChecked) {
      console.log('Re-validating session on component mount');
      const verifySession = async () => {
        try {
          const response = await fetch('/api/auth/session');
          const data = await response.json();
          if (!data || !data.user) {
            console.log('Session not valid on server, signing out');
            await signOut({ callbackUrl: '/auth/login' });
          }
        } catch (error) {
          console.error('Session verification error:', error);
        }
        setSessionChecked(true);
      };
      verifySession();
    }
  }, [status, sessionChecked]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-white/90 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gradient-primary flex items-center">
          <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Trade</span>
          <span className="text-gray-900">Tools</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'loading' || (status === 'authenticated' && !sessionChecked) ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-9 w-24 rounded bg-gray-200"></div>
              <div className="h-9 w-24 rounded bg-gray-200"></div>
            </div>
          ) : status === 'authenticated' && session?.user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  My Account
                </Button>
              </Link>
              <Button 
                variant="primary" 
                onClick={() => {
                  console.log('Signing out...');
                  signOut({ callbackUrl: '/auth/login' });
                }}
                className="flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-4 flex flex-col gap-3 mt-2">
          {status === 'loading' || (status === 'authenticated' && !sessionChecked) ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-10 w-full rounded bg-gray-200"></div>
              <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>
          ) : status === 'authenticated' && session?.user ? (
                <>
                  <Link href="/profile" className="w-full">
                    <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      My Account
                    </Button>
                  </Link>
                  <Button 
                    variant="primary" 
                    fullWidth 
                    onClick={() => {
                      console.log('Signing out (mobile)...');
                      signOut({ callbackUrl: '/auth/login' });
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="w-full">
                    <Button variant="ghost" fullWidth className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="w-full">
                    <Button variant="primary" fullWidth className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
