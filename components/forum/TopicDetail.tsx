import React from 'react'
import { Topic } from '@prisma/client'

interface TopicDetailProps {
  topic: Topic & {
    user: { name: string | null }
  }
}

export default function TopicDetail({ topic }: TopicDetailProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-4">{topic.title}</h1>
      
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: topic.body }} />
      
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Posted by <span className="font-medium">{topic.user?.name || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex space-x-2">
          {topic.tags.map(tag => (
            <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
