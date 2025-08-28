
'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Redirect {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
}

export default function RedirectsManager() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRedirects = async () => {
      try {
        const response = await fetch('/api/admin/seo/redirects');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setRedirects(data);
      } catch (err) {
        setError('Failed to load redirects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRedirects();
  }, []);

  if (loading) {
    return <div className="p-6">Loading redirects...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Redirects Manager</h1>
        <Link href="/admin/seo/redirects/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Redirect
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Current Redirects</h2>
        {redirects.length === 0 ? (
          <p className="text-muted-foreground">No redirects created yet</p>
        ) : (
          <div className="space-y-4">
            {redirects.map((redirect) => (
              <div key={redirect.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">{redirect.source}</p>
                  <p className="text-sm text-muted-foreground">
                    to {redirect.destination}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${redirect.permanent ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {redirect.permanent ? 'Permanent (301)' : 'Temporary (302)'}
                    </span>
                    <div className="flex space-x-2">
                        <Link href={`/admin/seo/redirects/${redirect.id}`}>
                            <Button size="sm" variant="outline" className="flex items-center">
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                            </Button>
                        </Link>
                        <Button size="sm" variant="danger" className="flex items-center">
                            <TrashIcon className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
