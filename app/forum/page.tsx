'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { PlusIcon, ChatBubbleLeftRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

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

interface Topic {
  id: string;
  title: string;
  body: string;
  likes: number;
  viewCount: number;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
  category: {
    name: string;
    color: string;
  } | null;
}

const ForumPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTopic, setNewTopic] = useState({
    title: '',
    body: '',
    categoryId: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [showNewTopicForm, setShowNewTopicForm] = useState(false);

  useEffect(() => {
    fetchTopics();
    fetchCategories();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await fetch('/api/forum/topics');
      if (!response.ok) {
        throw new Error('Failed to fetch topics');
      }
      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      // Ensure we're getting the right data structure
      if (data && data.categories && Array.isArray(data.categories)) {
        // Map to the expected interface (in case of extra fields)
        const mappedCategories = data.categories.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || null,
          icon: cat.icon || null,
          color: cat.color || null,
          order: cat.order || 0,
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: cat.updatedAt || new Date().toISOString()
        }));
        setCategories(mappedCategories);
      } else {
        console.error('Unexpected categories data format:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to some default categories for testing
      setCategories([
        { id: 'general', name: 'General Discussion', slug: 'general', description: null, icon: null, color: null, order: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'tech', name: 'Technology', slug: 'technology', description: null, icon: null, color: null, order: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTopic),
        credentials: 'include' // This ensures cookies are sent with the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create topic');
      }

      const data = await response.json();
      setTopics(prev => [data.topic, ...prev]);
      setNewTopic({
        title: '',
        body: '',
        categoryId: ''
      });
      setShowNewTopicForm(false);
      toast.success('Topic created successfully');
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error((error as Error).message || 'Failed to create topic');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-500" />
        <p className="mt-2">Loading forum...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Forum</h1>
        {session?.user ? (
          <Button 
            onClick={() => setShowNewTopicForm(!showNewTopicForm)}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        ) : (
          <Button 
            onClick={() => router.push('/auth/login')}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Sign in to Post
          </Button>
        )}
      </div>

      {/* New Topic Form */}
      {showNewTopicForm && session?.user && (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4 bg-gray-50">
            <h3 className="text-lg font-medium">Create New Topic</h3>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={newTopic.title}
                  onChange={handleInputChange}
                  placeholder="Enter topic title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  value={newTopic.categoryId}
                  onChange={handleInputChange}
                  required
                  options={[
                    { value: '', label: 'Select a category' },
                    ...categories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                />
                {categories.length === 0 && (
                  <div className="text-xs text-yellow-600 mt-1">
                    No categories loaded. Using fallback options.
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="body"
                  name="body"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={newTopic.body}
                  onChange={handleInputChange}
                  placeholder="Write your post content here..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewTopicForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Topic'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Topics List */}
      <div className="space-y-6">
        {topics.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No topics yet</h3>
            <p className="mt-1 text-gray-500">Be the first to start a discussion!</p>
          </div>
        ) : (
          topics.map(topic => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      {topic.category && (
                        <span 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
                          style={{ backgroundColor: `${topic.category.color}20`, color: topic.category.color }}
                        >
                          {topic.category.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatDate(topic.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      <Link href={`/forum/topic/${topic.id}`} className="hover:text-blue-600">
                        {topic.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {topic.body}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>
                          By {topic.user.name || topic.user.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {topic.viewCount}
                        </span>
                        <span className="flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {topic.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ForumPage;