import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const likeSchema = z.object({
  action: z.enum(['like', 'unlike'])
});

export async function POST(request: Request, { params }: { params: { topicId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = likeSchema.safeParse(body);
    
    if (!validation.success) {
      return new Response('Invalid request data', { status: 400 });
    }

    const { action } = validation.data;
    const topicId = params.topicId;

    // Verify topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      return new Response('Topic not found', { status: 404 });
    }

    // Check if user has already liked this topic
    const existingLike = await prisma.engagementEvent.findFirst({
      where: {
        userId: session.user.id,
        targetId: topicId,
        targetType: 'topic',
        type: 'LIKE'
      }
    });

    if (action === 'like') {
      if (existingLike) {
        return NextResponse.json({ message: 'Topic already liked' }, { status: 400 });
      }

      // Create engagement event and update like count
      await prisma.$transaction([
        prisma.engagementEvent.create({
          data: {
            id: crypto.randomUUID(),
            userId: session.user.id,
            targetId: topicId,
            targetType: 'topic',
            type: 'LIKE',
            createdAt: new Date()
          }
        }),
        prisma.topic.update({
          where: { id: topicId },
          data: { likes: { increment: 1 } }
        })
      ]);
    } else { // unlike
      if (!existingLike) {
        return NextResponse.json({ message: 'Topic not liked yet' }, { status: 400 });
      }

      // Remove engagement event and update like count
      await prisma.$transaction([
        prisma.engagementEvent.delete({
          where: { id: existingLike.id }
        }),
        prisma.topic.update({
          where: { id: topicId },
          data: { likes: { decrement: 1 } }
        })
      ]);
    }

    const updatedTopic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true, likes: true }
    });

    return NextResponse.json({ 
      ok: true, 
      likes: updatedTopic?.likes || 0 
    });
  } catch (error) {
    console.error('Error processing like:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
