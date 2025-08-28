'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SessionDebugPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log('Session Debug Page - Session State:', { session, status });
  }, [session, status]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Attempting login with:', { email, password });
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    
    console.log('Login result:', result);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    await signOut({ redirect: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Session Debug</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <p><strong>Status:</strong> {status}</p>
        {session && (
          <div className="mt-4">
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Email:</strong> {session.user?.email}</p>
            <p><strong>Name:</strong> {session.user?.name}</p>
            <p><strong>Role:</strong> {session.user?.role}</p>
          </div>
        )}
      </div>
      
      {!session && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Login Form</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>
      )}
      
      {session && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Go to Profile
          </button>
        </div>
      )}
    </div>
  );
}