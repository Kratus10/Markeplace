import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // First get pinned topics
    const pinnedTopics = await prisma.topic.findMany({
      where: {
        status: 'ACTIVE',
        isPinned: true
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          }
        },
        category: {
          select: {
            name: true,
            color: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Then get additional trending topics based on engagement
    const trendingTopics = await prisma.topic.findMany({
      where: {
        status: 'ACTIVE',
        isPinned: false
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          }
        },
        category: {
          select: {
            name: true,
            color: true,
          }
        }
      },
      orderBy: [
        {
          likes: 'desc'
        },
        {
          views: 'desc'
        },
        {
          shareCount: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ],
      take: Math.max(0, 10 - pinnedTopics.length) // Fill up to 10 total topics
    });

    // Combine pinned and trending topics
    const allTopics = [...pinnedTopics, ...trendingTopics];

    return NextResponse.json({ 
      ok: true, 
      topics: allTopics.map(topic => ({
        ...topic,
        engagementScore: topic.likes + topic.views + topic.shareCount
      }))
    });
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}