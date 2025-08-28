'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ErrorPage = ({ searchParams }: { searchParams: { error?: string } }) => {
  const error = searchParams.error || 'An unexpected error occurred';

  // Map common NextAuth errors to user-friendly messages
  const errorMessages: Record<string, string> = {
    'Configuration': 'There is a problem with the server configuration.',
    'AccessDenied': 'Access denied. You do not have permission to sign in.',
    'Verification': 'The verification token has expired or is invalid.',
    'Default': 'An error occurred during authentication.',
    'Invalid credentials': 'Invalid email or password.',
    'Email and password are required': 'Email and password are required.'
  };

  const displayError = errorMessages[error] || errorMessages['Default'];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {displayError}
          </p>
        </div>

        <div className="mt-8">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error Details
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/auth/login">
            <Button fullWidth>
              Try Again
            </Button>
          </Link>
          <div className="mt-3 text-center">
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create a new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;