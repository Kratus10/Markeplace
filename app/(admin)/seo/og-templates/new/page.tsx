
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import { toast } from 'sonner';

export default function NewOgTemplate() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('Creating new OG template...');

    try {
      const response = await fetch('/api/admin/seo/og-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, template }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      toast.success('Successfully created OG template!');
      router.push('/admin/seo/og-templates');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create template.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New OG Template</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Default, Blog Post, Product"
              required
            />
          </div>

          <div>
            <Label htmlFor="template">Template Code</Label>
            <Textarea
              id="template"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder="Enter your HTML/JSX template code here"
              rows={10}
              required
            />
             <p className="text-sm text-gray-500 mt-1">
              Use placeholders like &#123;&#123;title&#125;&#125; and &#123;&#123;description&#125;&#125;.
            </p>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
