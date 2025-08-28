
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import { toast } from 'sonner';

export default function NewPageOverride() {
  const router = useRouter();
  const [pagePath, setPagePath] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('Creating new SEO override...');

    try {
      const response = await fetch('/api/admin/seo/page-overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagePath, title, description, keywords }),
      });

      if (!response.ok) {
        throw new Error('Failed to create override');
      }

      toast.success('Successfully created SEO override!');
      router.push('/admin/seo/page-overrides');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create override.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New SEO Override</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="pagePath">Page Path</Label>
            <Input
              id="pagePath"
              type="text"
              value={pagePath}
              onChange={(e) => setPagePath(e.target.value)}
              placeholder="e.g., /about, /products/my-product"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              The path of the page to override, starting with a `/`.
            </p>
          </div>

          <div>
            <Label htmlFor="title">Meta Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Custom meta title for the page"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Meta Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Custom meta description for the page"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="keywords">Meta Keywords</Label>
            <Input
              id="keywords"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., keyword1, keyword2, keyword3"
            />
             <p className="text-sm text-muted-foreground mt-1">
              Comma-separated keywords.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Override'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
