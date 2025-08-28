import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This route is for tracking views when a topic is accessed
export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  try {
    // Increment view count on topic
    await prisma.topic.update({
      where: { id: params.topicId },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ viewed: true, message: 'View tracked' });
  } catch (error) {
    console.error('Error tracking view:', error);
    return new Response('Internal server error', { status: 500 });
  }
}