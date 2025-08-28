'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  color: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for creating/editing categories
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    order: 0,
  });
  
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }
    
    if (session.user.role !== 'ADMIN') {
      router.push('/'); // Redirect non-admins to home page
      return;
    }
    
    fetchCategories();
  }, [session, status, router]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/forum/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const url = isEditing 
        ? '/api/admin/forum/categories' 
        : '/api/admin/forum/categories';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: isEditing ? formData.id : undefined
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save category');
      }

      // Reset form and refresh categories
      setFormData({
        id: '',
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#3b82f6',
        order: 0,
      });
      setIsEditing(false);
      fetchCategories();
    } catch (err) {
      setError((err as Error).message || 'Failed to save category');
      console.error('Error saving category:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3b82f6',
      order: category.order,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/forum/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete category');
      }

      fetchCategories();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#3b82f6',
      order: 0,
    });
    setIsEditing(false);
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Forum Category Management</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Form */}
        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Category name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      placeholder="category-slug"
                      disabled={isEditing}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Used in URLs. Lowercase letters, numbers, and hyphens only.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Brief description of the category"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <Input
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleInputChange}
                        placeholder="e.g., 💻"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        value={formData.color}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                      Order
                    </label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.order}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Category' : 'Create Category')}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
        
        {/* Categories List */}
        <div>
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
              
              {loading ? (
                <p>Loading categories...</p>
              ) : categories.length === 0 ? (
                <p className="text-gray-500">No categories found.</p>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div 
                      key={category.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {category.icon && (
                              <span className="text-xl mr-2">{category.icon}</span>
                            )}
                            <h3 className="font-medium">{category.name}</h3>
                            {category.color && (
                              <span 
                                className="w-4 h-4 rounded-full ml-2 border" 
                                style={{ backgroundColor: category.color }}
                              ></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {category.description || 'No description'}
                          </p>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="font-mono">/{category.slug}</span>
                            <span className="mx-2">•</span>
                            Order: {category.order}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(category.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}