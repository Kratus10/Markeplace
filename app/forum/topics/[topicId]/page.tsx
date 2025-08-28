'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { UserCircleIcon, ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  user: User;
  likes: number;
}

interface Topic {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  likes: number;
  shareCount: number;
  user: User;
  category: {
    name: string;
    color: string;
  } | null;
  comments: Comment[];
}

const TopicPage = ({ params }: { params: { topicId: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTopic();
    trackView();
  }, [params.topicId]);

  const trackView = async () => {
    try {
      await fetch(`/api/forum/topics/${params.topicId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // We don't need to handle the response for view tracking
    } catch (error) {
      console.error('Error tracking view:', error);
      // Don't show an error to the user for view tracking
    }
  };

  const fetchTopic = async () => {
    try {
      const response = await fetch(`/api/forum/topics/${params.topicId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch topic');
      }
      const data = await response.json();
      setTopic(data.topic);
    } catch (error) {
      console.error('Error fetching topic:', error);
      toast.error('Failed to load topic');
      router.push('/forum');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeTopic = async () => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/forum/topics/${params.topicId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'like' })
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Like API error response:', errorText);
        
        // Try to parse as JSON, but fall back to plain text if it fails
        let errorMessage = `Failed to like topic: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If it's not JSON, use the text directly if it's not HTML
          if (!errorText.startsWith('<!DOCTYPE') && !errorText.startsWith('<html')) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Update the topic likes count
      setTopic(prev => prev ? {
        ...prev,
        likes: (prev.likes || 0) + 1
      } : null);
      
      toast.success('Topic liked!');
    } catch (error) {
      console.error('Error liking topic:', error);
      toast.error((error as Error).message || 'Failed to like topic');
    }
  };

  const handleShareTopic = async () => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/forum/topics/${params.topicId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Share API error response:', errorText);
        
        // Try to parse as JSON, but fall back to plain text if it fails
        let errorMessage = `Failed to share topic: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // If it's not JSON, use the text directly if it's not HTML
          if (!errorText.startsWith('<!DOCTYPE') && !errorText.startsWith('<html')) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Update the topic share count
      setTopic(prev => prev ? {
        ...prev,
        shareCount: (prev.shareCount || 0) + 1
      } : null);
      
      toast.success(data.message);
      
      // Also copy the URL to clipboard
      const url = `${window.location.origin}/forum/topic/${params.topicId}`;
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing topic:', error);
      toast.error((error as Error).message || 'Failed to share topic');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/forum/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topicId: params.topicId,
          body: newComment 
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Comment API error response:', errorText);
        
        // Try to parse as JSON, but fall back to plain text if it fails
        let errorMessage = `Failed to post comment: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          // If it's not JSON, use the text directly if it's not HTML
          if (!errorText.startsWith('<!DOCTYPE') && !errorText.startsWith('<html')) {
            errorMessage = errorText;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setTopic(prev => prev ? {
        ...prev,
        comments: [...prev.comments, data]
      } : null);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error((error as Error).message || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Topic not found</h3>
        <p className="mt-1 text-gray-500">The topic you're looking for doesn't exist or has been removed.</p>
        <div className="mt-6">
          <Link href="/forum" className="text-blue-600 hover:text-blue-500 font-medium">
            ← Back to forum
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/forum" className="text-blue-600 hover:text-blue-500 font-medium flex items-center">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to forum
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            {topic.category && (
              <span 
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${topic.category.color}20`, color: topic.category.color }}
              >
                {topic.category.name}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start mb-6">
            {topic.user.avatar ? (
              <img 
                src={topic.user.avatar} 
                alt={topic.user.name || 'User'} 
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
            <div className="ml-3">
              <h4 className="text-sm font-medium">
                {topic.user.name || topic.user.email}
              </h4>
              <p className="text-xs text-gray-500">
                {formatDate(topic.createdAt)}
              </p>
              <p className="text-xs text-gray-500">
                Views: {topic.viewCount || 0}
              </p>
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{topic.body}</p>
          </div>
          <div className="mt-6 flex items-center space-x-4">
            <button 
              onClick={handleLikeTopic}
              className="flex items-center text-sm text-gray-500 hover:text-red-500"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              Like ({topic.likes || 0})
            </button>
            <button 
              onClick={handleShareTopic}
              className="flex items-center text-sm text-gray-500 hover:text-blue-500"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share ({topic.shareCount || 0})
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Comments ({topic.comments.length})</h2>
      </div>

      {session?.user ? (
        <Card className="mb-8">
          <CardHeader className="px-6 py-4 bg-gray-50">
            <h3 className="text-lg font-medium">Post a comment</h3>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-4">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Please sign in to post a comment.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Sign in to comment
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {topic.comments.length === 0 ? (
          <div className="text-center py-8">
            <ChatBubbleLeftRightIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No comments yet</h3>
            <p className="mt-1 text-gray-500">Be the first to comment on this topic!</p>
          </div>
        ) : (
          topic.comments.map(comment => (
            <Card key={comment.id}>
              <CardContent className="p-6">
                <div className="flex items-start">
                  {comment.user.avatar ? (
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name || 'User'} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  )}
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium">
                        {comment.user.name || comment.user.email}
                      </h4>
                      <span className="mx-2 text-gray-300">•</span>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                      {comment.body}
                    </p>
                    <div className="mt-3 flex items-center">
                      <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        {comment.likes}
                      </button>
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

export default TopicPage;