import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Check if topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: params.topicId }
    });

    if (!topic) {
      return new Response('Topic not found', { status: 404 });
    }

    // Create share engagement event
    await prisma.engagementEvent.create({
      data: {
        userId: session.user.id,
        targetId: params.topicId,
        targetType: 'topic',
        type: 'SHARE'
      }
    });

    // Increment share count on topic
    await prisma.topic.update({
      where: { id: params.topicId },
      data: {
        shareCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ shared: true, message: 'Topic shared' });
  } catch (error) {
    console.error('Error sharing topic:', error);
    return new Response('Internal server error', { status: 500 });
  }
}