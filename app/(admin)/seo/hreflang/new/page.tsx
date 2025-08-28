
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function NewHreflangMapping() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [mappings, setMappings] = useState([{ lang: '', href: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMappingChange = (index: number, field: 'lang' | 'href', value: string) => {
    const newMappings = [...mappings];
    newMappings[index][field] = value;
    setMappings(newMappings);
  };

  const addMapping = () => {
    setMappings([...mappings, { lang: '', href: '' }]);
  };

  const removeMapping = (index: number) => {
    const newMappings = mappings.filter((_, i) => i !== index);
    setMappings(newMappings);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('Creating new hreflang mapping...');

    try {
      const response = await fetch('/api/admin/seo/hreflang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, mappings }),
      });

      if (!response.ok) {
        throw new Error('Failed to create mapping');
      }

      toast.success('Successfully created hreflang mapping!');
      router.push('/admin/seo/hreflang');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create mapping.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Hreflang Mapping</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g., product-123, about-page"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              A unique name to identify this group of mappings.
            </p>
          </div>

          <div>
            <Label>Language Mappings</Label>
            <div className="space-y-4">
              {mappings.map((mapping, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-grow grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor={`lang-${index}`}>Language Code</Label>
                        <Input
                            id={`lang-${index}`}
                            type="text"
                            value={mapping.lang}
                            onChange={(e) => handleMappingChange(index, 'lang', e.target.value)}
                            placeholder="e.g., en-US, de-DE"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor={`href-${index}`}>Full URL</Label>
                        <Input
                            id={`href-${index}`}
                            type="url"
                            value={mapping.href}
                            onChange={(e) => handleMappingChange(index, 'href', e.target.value)}
                            placeholder="https://example.com/us/page"
                            required
                        />
                    </div>
                  </div>
                  <Button type="button" variant="danger" size="sm" onClick={() => removeMapping(index)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={addMapping} className="mt-4">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another Language
            </Button>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Mapping'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
