'use client';

import ClientManager from '@/components/clients/ClientManager';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ClientManagerPage() {
  const { data: session, status } = useSession();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      if (status !== 'authenticated') return;
      
      try {
        const response = await fetch('/api/users/me/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        
        const data = await response.json();
        setClients(data.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }
    
    fetchClients();
  }, [status]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Please sign in to view this page</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Client Manager</h1>
      <ClientManager clients={clients} />
    </div>
  );
}
