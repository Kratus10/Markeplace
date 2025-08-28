'use client';

import React, { useState } from 'react';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import Button from '@/components/ui/Button';

interface Comment {
  id: string;
  body: string;
  bodyHtml?: string;
  createdAt: string;
  userId: string;
  user: { id: string; name: string; image: null | string };
  likes: number;
  hasLiked: boolean;
  shareCount: number;
  replies?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  topicId: string;
  onLike: (commentId: string) => void;
  onShare: (commentId: string) => void;
  onReply: (commentId: string) => void;
  onSubmitReply: (commentId: string, commentData: { body: string, bodyHtml: string }) => Promise<any>;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments, 
  topicId,
  onLike,
  onShare,
  onReply,
  onSubmitReply
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyForms, setReplyForms] = useState<Record<string, boolean>>({});

  if (!comments || comments.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-gray-500">No comments yet.</p>
      </div>
    );
  }

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyForms(prev => ({ ...prev, [commentId]: true }));
  };

  const handleCancelReply = (commentId: string) => {
    setReplyForms(prev => ({ ...prev, [commentId]: false }));
    setReplyingTo(null);
  };

  const handleSubmitReply = async (parentCommentId: string, commentData: { body: string, bodyHtml: string }) => {
    try {
      await onSubmitReply(parentCommentId, commentData);
      setReplyForms(prev => ({ ...prev, [parentCommentId]: false }));
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to submit reply:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id} className="pb-4 border-b border-gray-100 last:border-b-0">
          <CommentCard 
            comment={comment} 
            onLike={onLike}
            onShare={onShare}
            onReply={handleReplyClick}
          />
          
          {replyForms[comment.id] && (
            <div className="mt-4 ml-8">
              <CommentForm 
                topicId={topicId}
                parentId={comment.id}
                onSubmit={(data) => handleSubmitReply(comment.id, data)}
                onCancel={() => handleCancelReply(comment.id)}
              />
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-8 border-l-2 border-gray-200 pl-4">
              <CommentList 
                comments={comment.replies} 
                topicId={topicId}
                onLike={onLike}
                onShare={onShare}
                onReply={handleReplyClick}
                onSubmitReply={onSubmitReply}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;