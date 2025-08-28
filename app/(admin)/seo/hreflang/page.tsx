
'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface HreflangMapping {
  id: string;
  identifier: string; // e.g., 'product-123', 'about-page'
  mappings: { lang: string; href: string }[];
}

export default function HreflangManager() {
  const [mappings, setMappings] = useState<HreflangMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await fetch('/api/admin/seo/hreflang');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMappings(data);
      } catch (err) {
        setError('Failed to load hreflang mappings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMappings();
  }, []);

  if (loading) {
    return <div className="p-6">Loading hreflang mappings...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hreflang Mappings</h1>
        <Link href="/admin/seo/hreflang/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Mapping
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Current Mappings</h2>
        {mappings.length === 0 ? (
          <p className="text-muted-foreground">No mappings created yet</p>
        ) : (
          <div className="space-y-4">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-lg">{mapping.identifier}</p>
                    <div className="flex space-x-2">
                        <Link href={`/admin/seo/hreflang/${mapping.id}`}>
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
                <div className="mt-2 space-y-1">
                    {mapping.mappings.map((link, index) => (
                        <div key={index} className="flex items-center text-sm">
                            <span className="font-semibold w-16">{link.lang}:</span>
                            <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.href}</a>
                        </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
