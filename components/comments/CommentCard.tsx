// FILE: components/comments/CommentCard.tsx
import React from "react";
import { formatDistanceToNow } from "date-fns";
import ReportButton from "@/components/reports/ReportButton";

interface CommentCardProps {
  comment: {
    id: string;
    body: string;
    createdAt: Date;
    user: {
      name: string | null;
      username: string | null;
    };
    likes: number;
  };
  className?: string;
}

export default function CommentCard({ comment, className = "" }: CommentCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-slate-800">
              {comment.user.name || comment.user.username}
            </span>
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-slate-700 mb-3">
            {comment.body}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="text-sm text-slate-500 hover:text-blue-600">
                Like ({comment.likes})
              </button>
              <button className="text-sm text-slate-500 hover:text-blue-600">
                Reply
              </button>
            </div>
            
            <ReportButton targetType="COMMENT" targetId={comment.id} />
          </div>
        </div>
      </div>
    </div>
  );
}