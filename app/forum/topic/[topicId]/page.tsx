import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import TopicPageClient from './components/TopicPageClient';

// Fetch topic from API
async function getTopic(topicId: string) {
  try {
    // Get base URL for API requests
    const headersList = headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/forum/topics/${topicId}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch topic');
    }
    
    const data = await response.json();
    return data.topic;
  } catch (error) {
    console.error('Error fetching topic:', error);
    return null;
  }
}

export default async function TopicPage({ params }: { params: { topicId: string } }) {
  const topic = await getTopic(params.topicId);
  
  if (!topic) {
    return notFound();
  }

  // Add fallback for comments bodyHtml
  const topicWithHtml = {
    ...topic,
    bodyHtml: topic.bodyHtml || `<p>${topic.body}</p>`,
    comments: topic.comments.map((comment: any) => ({
      ...comment,
      bodyHtml: comment.bodyHtml || `<p>${comment.body}</p>`
    }))
  };

  return <TopicPageClient topic={topicWithHtml} />;
}
