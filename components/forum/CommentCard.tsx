'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, Share2, Reply } from 'lucide-react';
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
}

interface CommentCardProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onShare: (commentId: string) => void;
  onReply: (commentId: string) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({ 
  comment,
  onLike,
  onShare,
  onReply
}) => {
  const [isLiked, setIsLiked] = useState(comment.hasLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    onLike(comment.id);
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleShare = () => {
    onShare(comment.id);
  };

  const handleReply = () => {
    onReply(comment.id);
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
          <span className="text-gray-500 font-medium">
            {comment.user.name.charAt(0)}
          </span>
        </div>
      </div>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{comment.user.name}</span>
            <time 
              className="text-sm text-gray-500"
              dateTime={comment.createdAt}
            >
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </time>
          </div>
          
          <div className="mt-2 text-gray-700">
            {comment.bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: comment.bodyHtml }} />
            ) : (
              <p>{comment.body}</p>
            )}
          </div>
        </div>
        
        <div className="mt-2 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            className={`flex items-center text-sm ${isLiked ? 'text-blue-600' : 'text-gray-500'}`}
          >
            <ThumbsUp size={16} className="mr-1" />
            {likeCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
            className="flex items-center text-sm text-gray-500"
          >
            <Share2 size={16} className="mr-1" />
            Share
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleReply}
            className="flex items-center text-sm text-gray-500"
          >
            <Reply size={16} className="mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;