'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [status, session]);

  const fetchDebugInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-user');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error('Debug error:', error);
      setDebugInfo({ error: error.message });
    }
    setLoading(false);
  };

  if (status === 'loading') {
    return <div>Loading session...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Client Session</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
      
      <button 
        onClick={fetchDebugInfo}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Fetch Server Debug Info'}
      </button>
      
      {debugInfo && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Server Debug Info</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}