'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import CommentCard from '@/components/forum/CommentCard';
import CommentForm from '@/components/forum/CommentForm';

export default function TopicPageClient({ topic }: { topic: any }) {
  const [currentTopic, setCurrentTopic] = useState(topic);
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(topic.likes || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const refreshTopic = async () => {
    setLoading(true);
    try {
      // Use absolute URL for client-side requests
      const response = await fetch(`${window.location.origin}/api/forum/topics/${topic.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch topic');
      }
      const data = await response.json();
      setCurrentTopic(data.topic);
    } catch (error) {
      console.error('Error refreshing topic:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = async () => {
    await refreshTopic();
  };

  const handleLike = async () => {
    if (!topic) return;
    
    try {
      setLikeLoading(true);
      const action = hasLiked ? 'unlike' : 'like';
      
      const response = await fetch(`/api/forum/topics/${topic.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to like topic');
      }

      const data = await response.json();
      setLikeCount(data.likes);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error('Error liking topic:', error);
      alert((error as Error).message || 'Failed to like topic');
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 mb-8">
        <div className="flex items-start mb-4">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{currentTopic.title}</h1>
            <div className="flex items-center text-sm text-gray-600">
              <span>By {currentTopic.user?.name || 'Unknown'}</span>
              <span className="mx-2">•</span>
              <span>
                {new Date(currentTopic.createdAt).toLocaleDateString()}
              </span>
              <span className="mx-2">•</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {currentTopic.category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <div 
          className="prose max-w-none mb-6"
          dangerouslySetInnerHTML={{ __html: currentTopic.bodyHtml || currentTopic.body }}
        />

        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="flex flex-wrap gap-2">
            {currentTopic.tags?.map((tag: string) => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex gap-4 mt-2 sm:mt-0">
            <button 
              className={`flex items-center ${hasLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              disabled={likeLoading}
              onClick={handleLike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {likeLoading ? '...' : hasLiked ? 'Liked' : 'Like'} ({likeCount})
            </button>
            
            <button 
              className="flex items-center text-gray-600 hover:text-green-600"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </Card>

      <h2 className="text-xl font-bold mb-4">
        {currentTopic.comments?.length || 0} Comments
      </h2>

      <div className="space-y-6">
        {currentTopic.comments?.map((comment: any) => (
          <CommentCard 
            key={comment.id} 
            comment={comment} 
            onLike={() => {}} 
            onShare={() => {}} 
            onReply={() => {}}
          />
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Add a comment</h3>
        <CommentForm 
          topicId={currentTopic.id} 
          onSubmit={handleCommentAdded}
        />
      </div>
    </div>
  );
}
