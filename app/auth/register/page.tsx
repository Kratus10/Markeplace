'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          displayName: name,
          username,
          email, 
          password 
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      // Show success message and redirect to login page
      toast.success('Account created successfully! Please check your email for verification.');
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError((err as Error).message || 'An error occurred during registration. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        
        {/* Google Sign-In Button - Commented out as requested */}
        {/* <div className="mt-6">
          <Button
            type="button"
            fullWidth
            variant="outline"
            // onClick={() => signIn('google')}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-blue-500" />
            Sign up with Google
          </Button>
        </div> */}

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (at least 8 characters)"
              icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div>
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>
        
        <div className="text-center text-xs text-gray-500">
          <p>
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
