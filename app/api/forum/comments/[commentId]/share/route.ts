import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { commentId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId }
    });

    if (!comment) {
      return new Response('Comment not found', { status: 404 });
    }

    // Create share engagement event
    await prisma.engagementEvent.create({
      data: {
        userId: session.user.id,
        targetId: params.commentId,
        targetType: 'comment',
        type: 'SHARE'
      }
    });

    // Increment share count on comment
    await prisma.comment.update({
      where: { id: params.commentId },
      data: {
        shareCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ shared: true, message: 'Comment shared' });
  } catch (error) {
    console.error('Error sharing comment:', error);
    return new Response('Internal server error', { status: 500 });
  }
}