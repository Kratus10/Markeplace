'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
  order: number;
}

const ForumCategoryAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    order: 0
  });

  // In a real implementation, this would fetch from an API
  useEffect(() => {
    // Mock data for demonstration
    const mockCategories: Category[] = [
      {
        id: 'tech',
        name: 'Technology',
        slug: 'technology',
        description: 'Discussions about technology trends and innovations',
        icon: '💻',
        color: '#3b82f6',
        order: 1
      },
      {
        id: 'ai',
        name: 'Artificial Intelligence',
        slug: 'ai',
        description: 'AI research, applications, and discussions',
        icon: '🤖',
        color: '#8b5cf6',
        order: 2
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        slug: 'crypto',
        description: 'Crypto markets, trading, and blockchain technology',
        icon: '₿',
        color: '#f59e0b',
        order: 3
      }
    ];
    
    setCategories(mockCategories);
    setLoading(false);
  }, []);

  const handleCreateCategory = () => {
    if (!newCategory.name || !newCategory.slug) {
      alert('Name and slug are required');
      return;
    }
    
    // In a real implementation, this would call an API
    const createdCategory: Category = {
      ...newCategory,
      id: newCategory.slug,
      description: newCategory.description || null,
      icon: newCategory.icon || null
    };
    
    setCategories([...categories, createdCategory]);
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#3b82f6',
      order: 0
    });
    setIsCreating(false);
    alert('Category created successfully!');
  };

  const handleDeleteCategory = (id: string) => {
    // In a real implementation, this would call an API
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      alert('Category deleted successfully!');
    }
  };

  if (loading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forum Categories</h1>
        <Button variant="primary" onClick={() => setIsCreating(true)}>
          Create Category
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <Input
                value={newCategory.slug}
                onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                placeholder="category-slug"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <Input
                value={newCategory.icon}
                onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                placeholder="Emoji or icon"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <Input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={newCategory.description}
              onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
              placeholder="Category description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCategory}>
              Create Category
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {category.order}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForumCategoryAdmin;