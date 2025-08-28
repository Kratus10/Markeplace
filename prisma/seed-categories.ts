import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  try {
    console.log('Seeding forum categories...');
    
    const categories = [
      {
        id: 'announcements',
        name: 'Announcements',
        slug: 'announcements',
        description: 'Official announcements and updates',
        icon: '📢',
        color: '#0ea5e9',
        order: 1
      },
      {
        id: 'general',
        name: 'General Discussion',
        slug: 'general',
        description: 'General discussions and off-topic conversations',
        icon: '💬',
        color: '#6b7280',
        order: 2
      },
      {
        id: 'tech',
        name: 'Technology',
        slug: 'technology',
        description: 'Discussions about technology trends and innovations',
        icon: '💻',
        color: '#3b82f6',
        order: 3
      },
      {
        id: 'ai',
        name: 'Artificial Intelligence',
        slug: 'ai',
        description: 'AI research, applications, and discussions',
        icon: '🤖',
        color: '#8b5cf6',
        order: 4
      },
      {
        id: 'trading',
        name: 'Trading Strategies',
        slug: 'trading',
        description: 'Share and discuss trading strategies and techniques',
        icon: '📊',
        color: '#10b981',
        order: 5
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        slug: 'crypto',
        description: 'Crypto markets, trading, and blockchain technology',
        icon: '₿',
        color: '#f59e0b',
        order: 6
      },
      {
        id: 'sports',
        name: 'Sports',
        slug: 'sports',
        description: 'Discussions about sports events and athletes',
        icon: '⚽',
        color: '#ef4444',
        order: 7
      },
      {
        id: 'help',
        name: 'Help & Support',
        slug: 'help',
        description: 'Get help and support from the community',
        icon: '❓',
        color: '#8b5cf6',
        order: 8
      }
    ];
    
    for (const category of categories) {
      // Check if category already exists
      const existing = await prisma.category.findUnique({
        where: { id: category.id }
      });
      
      if (existing) {
        console.log(`Category ${category.name} already exists, updating...`);
        await prisma.category.update({
          where: { id: category.id },
          data: category
        });
      } else {
        console.log(`Creating category ${category.name}...`);
        await prisma.category.create({
          data: category
        });
      }
    }
    
    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();