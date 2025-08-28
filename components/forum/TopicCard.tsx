import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, ThumbsUp, Share2, Eye } from 'lucide-react';

interface TopicCardProps {
  topic: any;
  isDetailView?: boolean;
}

export default function TopicCard({ topic, isDetailView = false }: TopicCardProps) {
  return (
    <div className={`p-4 ${isDetailView ? 'border-b' : 'hover:bg-gray-50'}`}>
      {isDetailView ? (
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{topic.title}</h1>
      ) : (
        <Link href={`/forum/topic/${topic.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary">
            {topic.title}
          </h3>
        </Link>
      )}
      
      <div className="mt-2 flex items-center text-sm text-gray-500">
        <div className="flex items-center">
          <span className="text-primary font-medium">{topic.user.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={topic.createdAt}>
            {formatDistanceToNow(new Date(topic.createdAt), { addSuffix: true })}
          </time>
        </div>
        
        <div className="ml-auto flex items-center space-x-3">
          <span className="flex items-center">
            <Eye size={16} className="mr-1" />
            {topic.viewCount || 0}
          </span>
          
          <span className="flex items-center">
            <ThumbsUp size={16} className="mr-1" />
            {topic.likes || 0}
          </span>
          
          <span className="flex items-center">
            <Share2 size={16} className="mr-1" />
            {topic.shareCount || 0}
          </span>
          
          {!isDetailView && (
            <span className="flex items-center">
              <MessageCircle size={16} className="mr-1" />
              {topic.commentCount}
            </span>
          )}
        </div>
      </div>
      
      {isDetailView && (
        <>
          <div className="mt-4 text-gray-700">
            {topic.bodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: topic.bodyHtml }} />
            ) : (
              <p>{topic.body}</p>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}