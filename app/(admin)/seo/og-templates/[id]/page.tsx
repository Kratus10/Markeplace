
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

interface OgTemplate {
  id: string;
  name: string;
  template: string;
}

export default function EditOgTemplate() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [template, setTemplate] = useState<OgTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTemplate = useCallback(async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/admin/seo/og-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch template data');
      }
      const data = await response.json();
      setTemplate(data);
    } catch (error) {
      console.error(error);
      toast.error('Could not load template data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!template) return;

    setIsSubmitting(true);
    toast.info('Updating OG template...');

    try {
      const response = await fetch(`/api/admin/seo/og-templates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      toast.success('Successfully updated OG template!');
      router.push('/admin/seo/og-templates');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    setIsDeleting(true);
    toast.info('Deleting OG template...');

    try {
      const response = await fetch(`/api/admin/seo/og-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      toast.success('Successfully deleted OG template!');
      router.push('/admin/seo/og-templates');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete template.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (template) {
      setTemplate({ ...template, [name]: value });
    }
  };

  if (loading) {
    return <div className="p-6 flex justify-center items-center"><Spinner /></div>;
  }

  if (!template) {
    return <div className="p-6 text-red-500">Template not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit OG Template</h1>
      <Card className="p-6">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={template.name}
              onChange={handleInputChange}
              placeholder="e.g., Default, Blog Post, Product"
              required
            />
          </div>

          <div>
            <Label htmlFor="template">Template Code</Label>
            <Textarea
              id="template"
              name="template"
              value={template.template}
              onChange={handleInputChange}
              placeholder="Enter your HTML/JSX template code here"
              rows={10}
              required
            />
             <p className="text-sm text-muted-foreground mt-1">
              Use placeholders like {'{title}'}, {'{description}'} for dynamic content
            </p>
          </div>

          <div className="flex justify-between items-center">
             <Button type="button" variant="danger" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Template'}
            </Button>
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Template'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
