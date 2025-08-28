// FILE: components/topics/TopicCard.tsx
import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ReportButton from "@/components/reports/ReportButton";

interface TopicCardProps {
  topic: {
    id: string;
    title: string;
    body: string;
    createdAt: Date;
    user: {
      name: string | null;
      username: string | null;
    };
    category: {
      name: string;
      color: string;
    } | null;
    likes: number;
    comments: any[];
  };
  className?: string;
}

export default function TopicCard({ topic, className = "" }: TopicCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {topic.category && (
              <span 
                className="inline-block px-2 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: topic.category.color }}
              >
                {topic.category.name}
              </span>
            )}
            <span className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            <Link href={`/topics/${topic.id}`} className="hover:text-blue-600">
              {topic.title}
            </Link>
          </h3>
          
          <p className="text-slate-600 mb-4 line-clamp-2">
            {topic.body}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                by {topic.user.name || topic.user.username}
              </span>
              <span className="text-sm text-slate-500">
                {topic.comments.length} comments
              </span>
              <span className="text-sm text-slate-500">
                {topic.likes} likes
              </span>
            </div>
            
            <ReportButton targetType="TOPIC" targetId={topic.id} />
          </div>
        </div>
      </div>
    </div>
  );
}