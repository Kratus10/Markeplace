
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { toast } from 'sonner';
import Checkbox from '@/components/ui/Checkbox';

export default function NewRedirect() {
  const router = useRouter();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [permanent, setPermanent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.info('Creating new redirect...');

    try {
      const response = await fetch('/api/admin/seo/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, destination, permanent }),
      });

      if (!response.ok) {
        throw new Error('Failed to create redirect');
      }

      toast.success('Successfully created redirect!');
      router.push('/admin/seo/redirects');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create redirect.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Redirect</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="source">Source Path</Label>
            <Input
              id="source"
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., /old-path/page"
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              The path you want to redirect from.
            </p>
          </div>

          <div>
            <Label htmlFor="destination">Destination Path</Label>
            <Input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., /new-path/page"
              required
            />
             <p className="text-sm text-muted-foreground mt-1">
              The path you want to redirect to.
            </p>
          </div>

           <div className="flex items-center space-x-2">
            <Checkbox
                id="permanent"
                checked={permanent}
                onChange={(checked) => setPermanent(checked)}
            />
            <Label htmlFor="permanent">Permanent (301) Redirect</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Redirect'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
