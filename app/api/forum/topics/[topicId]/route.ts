import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { topicId: string } }) {
  try {
    const topicId = params.topicId.toLowerCase();
    
    // Increment view count
    await prisma.topic.update({
      where: { id: topicId },
      data: { views: { increment: 1 } }
    });
    
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        user: {
          select: { id: true, name: true }
        },
        category: true,
        comments: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!topic) {
      return new Response('Topic not found', { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      topic: {
        ...topic,
        likes: topic?.likes || 0,
        viewCount: topic?.views || 0,
        shareCount: topic?.shareCount || 0,
        commentCount: topic?.comments?.length || 0,
        comments: (topic?.comments || []).map(comment => ({
          ...comment,
          likes: comment.likes || 0
        }))
      }
  });
  } catch (error) {
    console.error('Error fetching topic:', error);
    // Ensure proper JSON error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
