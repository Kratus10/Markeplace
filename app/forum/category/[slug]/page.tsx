import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TopicCard from '@/components/forum/TopicCard';

// Mock function to get category by slug
async function getCategoryBySlug(slug: string) {
  // In a real implementation, this would fetch from the API
  const categories = [
    {
      id: 'tech',
      name: 'Technology',
      slug: 'technology',
      description: 'Discussions about technology trends and innovations',
      icon: '💻',
      color: '#3b82f6'
    },
    {
      id: 'ai',
      name: 'Artificial Intelligence',
      slug: 'ai',
      description: 'AI research, applications, and discussions',
      icon: '🤖',
      color: '#8b5cf6'
    },
    {
      id: 'trading',
      name: 'Trading Strategies',
      slug: 'trading',
      description: 'Share and discuss trading strategies and techniques',
      icon: '📊',
      color: '#10b981'
    },
    {
      id: 'sports',
      name: 'Sports',
      slug: 'sports',
      description: 'Discussions about sports events and athletes',
      icon: '⚽',
      color: '#ef4444'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      slug: 'crypto',
      description: 'Crypto markets, trading, and blockchain technology',
      icon: '₿',
      color: '#f59e0b'
    },
    {
      id: 'general',
      name: 'General Discussion',
      slug: 'general',
      description: 'General discussions and off-topic conversations',
      icon: '💬',
      color: '#6b7280'
    },
    {
      id: 'announcements',
      name: 'Announcements',
      slug: 'announcements',
      description: 'Official announcements and updates',
      icon: '📢',
      color: '#0ea5e9'
    },
    {
      id: 'help',
      name: 'Help & Support',
      slug: 'help',
      description: 'Get help and support from the community',
      icon: '❓',
      color: '#8b5cf6'
    }
  ];

  return categories.find(category => category.slug === slug) || null;
}

// Mock function to get topics by category
async function getTopicsByCategory(categoryId: string) {
  // In a real implementation, this would fetch from the API
  const allTopics = [
    {
      id: '1',
      title: 'Welcome to the forum!',
      body: 'This is a sample topic',
      tags: ['welcome', 'introduction'],
      categoryId: 'tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '1',
      user: { id: '1', name: 'Admin' },
      _count: { comments: 15 },
      commentCount: 15,
      hasLiked: false,
      likes: 24,
      shareCount: 5,
      viewCount: 128
    },
    {
      id: '2',
      title: 'How to use this platform',
      body: 'Guide for new members',
      tags: ['guide', 'help'],
      categoryId: 'tech',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      userId: '2',
      user: { id: '2', name: 'Moderator' },
      _count: { comments: 8 },
      commentCount: 8,
      hasLiked: true,
      likes: 17,
      shareCount: 3,
      viewCount: 89
    },
    {
      id: '3',
      title: 'Market analysis techniques',
      body: 'Discussion about trading strategies',
      tags: ['trading', 'analysis'],
      categoryId: 'trading',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      userId: '3',
      user: { id: '3', name: 'TraderPro' },
      _count: { comments: 22 },
      commentCount: 22,
      hasLiked: false,
      likes: 31,
      shareCount: 7,
      viewCount: 205
    }
  ];

  return allTopics.filter(topic => topic.categoryId === categoryId);
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    return notFound();
  }

  const topics = await getTopicsByCategory(category.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4 text-xl"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <Link href="/forum/new">
          <Button variant="primary">New Topic</Button>
        </Link>
      </div>
      
      <Card className="p-4">
        {topics.length > 0 ? (
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No topics found in this category.</p>
            <Link href="/forum/new">
              <Button variant="primary">Create the first topic</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}