
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface HreflangMapping {
  id: string;
  identifier: string;
  mappings: { lang: string; href: string }[];
}

export default function EditHreflangMapping() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [mapping, setMapping] = useState<HreflangMapping | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMapping = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/admin/seo/hreflang/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch mapping data');
      }
      const data = await response.json();
      setMapping(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load mapping data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMapping();
  }, [fetchMapping]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapping) return;

    setIsSubmitting(true);
    toast.info('Updating hreflang mapping...');

    try {
      const response = await fetch(`/api/admin/seo/hreflang/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mapping),
      });

      if (!response.ok) {
        throw new Error('Failed to update mapping');
      }

      toast.success('Successfully updated hreflang mapping!');
      router.push('/admin/seo/hreflang');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update mapping.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this mapping?')) {
      return;
    }

    setIsDeleting(true);
    toast.info('Deleting hreflang mapping...');

    try {
      const response = await fetch(`/api/admin/seo/hreflang/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete mapping');
      }

      toast.success('Successfully deleted hreflang mapping!');
      router.push('/admin/seo/hreflang');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete mapping.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIdentifierChange = (value: string) => {
      if(mapping) {
          setMapping({...mapping, identifier: value});
      }
  }

  const handleMappingChange = (index: number, field: 'lang' | 'href', value: string) => {
    if (mapping) {
        const newMappings = [...mapping.mappings];
        newMappings[index][field] = value;
        setMapping({ ...mapping, mappings: newMappings });
    }
  };

  const addMapping = () => {
      if(mapping){
        setMapping({ ...mapping, mappings: [...mapping.mappings, { lang: '', href: '' }] });
      }
  };

  const removeMapping = (index: number) => {
    if(mapping){
        const newMappings = mapping.mappings.filter((_, i) => i !== index);
        setMapping({ ...mapping, mappings: newMappings });
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><Spinner /></div>;
  }

  if (!mapping) {
    return <div className="p-6 text-red-500">Mapping not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Hreflang Mapping</h1>
      <Card className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
           <div>
            <Label htmlFor="identifier">Identifier</Label>
            <Input
              id="identifier"
              type="text"
              value={mapping.identifier}
              onChange={(e) => handleIdentifierChange(e.target.value)}
              placeholder="e.g., product-123, about-page"
              required
            />
          </div>

          <div>
            <Label>Language Mappings</Label>
            <div className="space-y-4">
              {mapping.mappings.map((m, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-grow grid grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor={`lang-${index}`}>Language Code</Label>
                        <Input
                            id={`lang-${index}`}
                            type="text"
                            value={m.lang}
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
                            value={m.href}
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

          <div className="flex justify-between items-center">
             <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Mapping'}
            </Button>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Mapping'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
