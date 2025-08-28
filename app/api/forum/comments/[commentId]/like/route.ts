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

    // Check if user already liked this comment
    const existingLike = await prisma.engagementEvent.findUnique({
      where: {
        userId_targetId_type: {
          userId: session.user.id,
          targetId: params.commentId,
          type: 'LIKE'
        }
      }
    });

    if (existingLike) {
      // Unlike - remove the engagement event
      await prisma.engagementEvent.delete({
        where: {
          id: existingLike.id
        }
      });

      // Decrement like count on comment
      await prisma.comment.update({
        where: { id: params.commentId },
        data: {
          likes: {
            decrement: 1
          }
        }
      });

      return NextResponse.json({ liked: false, message: 'Comment unliked' });
    } else {
      // Like - create engagement event
      await prisma.engagementEvent.create({
        data: {
          userId: session.user.id,
          targetId: params.commentId,
          targetType: 'comment',
          type: 'LIKE'
        }
      });

      // Increment like count on comment
      await prisma.comment.update({
        where: { id: params.commentId },
        data: {
          likes: {
            increment: 1
          }
        }
      });

      return NextResponse.json({ liked: true, message: 'Comment liked' });
    }
  } catch (error) {
    console.error('Error liking comment:', error);
    return new Response('Internal server error', { status: 500 });
  }
}