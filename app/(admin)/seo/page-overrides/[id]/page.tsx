
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';

interface PageOverride {
  id: string;
  pagePath: string;
  title: string;
  description: string | null;
  keywords: string | null;
}

export default function EditPageOverride() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [override, setOverride] = useState<PageOverride | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchOverride = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/admin/seo/page-overrides/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch override data');
      }
      const data = await response.json();
      setOverride(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load override data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOverride();
  }, [fetchOverride]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!override) return;

    setIsSubmitting(true);
    toast.info('Updating SEO override...');

    try {
      const response = await fetch(`/api/admin/seo/page-overrides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(override),
      });

      if (!response.ok) {
        throw new Error('Failed to update override');
      }

      toast.success('Successfully updated SEO override!');
      router.push('/admin/seo/page-overrides');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update override.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this override?')) {
      return;
    }

    setIsDeleting(true);
    toast.info('Deleting SEO override...');

    try {
      const response = await fetch(`/api/admin/seo/page-overrides/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete override');
      }

      toast.success('Successfully deleted SEO override!');
      router.push('/admin/seo/page-overrides');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete override.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (override) {
      setOverride({ ...override, [name]: value });
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><Spinner /></div>;
  }

  if (!override) {
    return <div className="p-6 text-red-500">Override not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit SEO Override</h1>
      <Card className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <Label htmlFor="pagePath">Page Path</Label>
            <Input
              id="pagePath"
              name="pagePath"
              type="text"
              value={override.pagePath}
              onChange={handleInputChange}
              placeholder="e.g., /about, /products/my-product"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Meta Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={override.title}
              onChange={handleInputChange}
              placeholder="Custom meta title for the page"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              name="description"
              value={override.description || ''}
              onChange={handleInputChange}
              placeholder="Custom meta description for the page"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Meta Keywords</Label>
            <Input
              id="keywords"
              name="keywords"
              type="text"
              value={override.keywords || ''}
              onChange={handleInputChange}
              placeholder="e.g., keyword1, keyword2, keyword3"
            />
          </div>

          <div className="flex justify-between items-center">
             <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Override'}
            </Button>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Override'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
