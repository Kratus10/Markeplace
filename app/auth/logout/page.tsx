'use client';

import React, { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    signOut({ 
      callbackUrl: '/auth/login',
      redirect: true
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <ArrowPathIcon className="h-12 w-12 animate-spin mx-auto text-blue-500" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Signing you out...
        </h2>
        <p className="text-center text-gray-600">
          Please wait while we securely sign you out of your account.
        </p>
      </div>
    </div>
  );
};

export default LogoutPage;