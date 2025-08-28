
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';
import Checkbox from '@/components/ui/Checkbox';

interface Redirect {
  id: string;
  source: string;
  destination: string;
  permanent: boolean;
}

export default function EditRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [redirect, setRedirect] = useState<Redirect | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRedirect = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch redirect data');
      }
      const data = await response.json();
      setRedirect(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load redirect data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRedirect();
  }, [fetchRedirect]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redirect) return;

    setIsSubmitting(true);
    toast.info('Updating redirect...');

    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(redirect),
      });

      if (!response.ok) {
        throw new Error('Failed to update redirect');
      }

      toast.success('Successfully updated redirect!');
      router.push('/admin/seo/redirects');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update redirect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this redirect?')) {
      return;
    }

    setIsDeleting(true);
    toast.info('Deleting redirect...');

    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete redirect');
      }

      toast.success('Successfully deleted redirect!');
      router.push('/admin/seo/redirects');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete redirect.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (redirect) {
      setRedirect({ ...redirect, [name]: value });
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><Spinner /></div>;
  }

  if (!redirect) {
    return <div className="p-6 text-red-500">Redirect not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Redirect</h1>
      <Card className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <Label htmlFor="source">Source Path</Label>
            <Input
              id="source"
              name="source"
              type="text"
              value={redirect.source}
              onChange={handleInputChange}
              placeholder="e.g., /old-path/page"
              required
            />
          </div>

          <div>
            <Label htmlFor="destination">Destination Path</Label>
            <Input
              id="destination"
              name="destination"
              type="text"
              value={redirect.destination}
              onChange={handleInputChange}
              placeholder="e.g., /new-path/page"
              required
            />
          </div>

           <div className="flex items-center space-x-2">
            <Checkbox
                id="permanent"
                checked={redirect.permanent}
                onChange={(checked) => setRedirect({ ...redirect, permanent: checked })}
            />
            <Label htmlFor="permanent">Permanent (301) Redirect</Label>
          </div>

          <div className="flex justify-between items-center">
             <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Redirect'}
            </Button>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Redirect'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
