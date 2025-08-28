// Test component to verify authentication status
'use client';

import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth';

export default function AuthTest() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const sessionData = await getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Auth Test</h1>
      {session ? (
        <div>
          <p>Authenticated as: {session.user?.email}</p>
          <p>User ID: {session.user?.id}</p>
          <p>Role: {session.user?.role}</p>
        </div>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
}