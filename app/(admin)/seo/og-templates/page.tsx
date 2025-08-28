
'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface OgTemplate {
  id: string;
  name: string;
  template: string; // For simplicity, we'll store the template as a string
}

export default function OgTemplatesManager() {
  const [templates, setTemplates] = useState<OgTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/admin/seo/og-templates');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTemplates(data);
      } catch (err) {
        setError('Failed to load OG templates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return <div className="p-6">Loading OG templates...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Open Graph Image Templates</h1>
        <Link href="/admin/seo/og-templates/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Current Templates</h2>
        {templates.length === 0 ? (
          <p className="text-muted-foreground">No templates created yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4 flex flex-col">
                <div className="flex-grow">
                    <p className="font-medium">{template.name}</p>
                    <div className="w-full bg-gray-200 aspect-video my-2">
                        {/* In a real app, we would render a preview of the template here */}
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Link href={`/admin/seo/og-templates/${template.id}`}>
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
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
