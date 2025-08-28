'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function NewTopicPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const router = useRouter();

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/forum/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        
        if (data && data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryId) {
      alert('Please select a category');
      return;
    }
    
    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          body, 
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          categoryId
        }),
        credentials: 'include' // This ensures cookies are sent with the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create topic');
      }

      const data = await response.json();
      router.push(`/forum/topic/${data.topic.id}`);
    } catch (err) {
      console.error('Error creating topic:', err);
      alert((err as Error).message || 'Failed to create topic');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Topic</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            {loadingCategories ? (
              <div className="p-2 text-gray-500">Loading categories...</div>
            ) : (
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                options={[
                  { value: '', label: 'Select a category' },
                  ...categories.map(category => ({
                    value: category.id,
                    label: category.name
                  }))
                ]}
                required
              />
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What would you like to discuss?"
              rows={8}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="trading, indicators, beginners"
            />
            <p className="mt-1 text-xs text-gray-500">
              Add up to 5 tags to categorize your topic
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary" 
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
            >
              Create Topic
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
