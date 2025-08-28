'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiSession, setApiSession] = useState(null);

  useEffect(() => {
    const fetchApiSession = async () => {
      try {
        const response = await fetch('/api/auth/debug');
        const data = await response.json();
        setApiSession(data);
      } catch (error) {
        console.error('Error fetching API session:', error);
      }
    };

    fetchApiSession();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Client Session (useSession)</h2>
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
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Server Session (API)</h2>
          {apiSession ? (
            <div>
              <p><strong>Message:</strong> {apiSession.message}</p>
              {apiSession.session && (
                <div className="mt-4">
                  <p><strong>User ID:</strong> {apiSession.session.user?.id}</p>
                  <p><strong>Email:</strong> {apiSession.session.user?.email}</p>
                  <p><strong>Name:</strong> {apiSession.session.user?.name}</p>
                  <p><strong>Role:</strong> {apiSession.session.user?.role}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button 
          onClick={() => router.push('/auth/login')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
        <button 
          onClick={() => router.push('/profile')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
}