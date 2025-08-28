import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const schema = z.object({
    topicId: z.string(),
    content: z.string().min(3).max(5000),
    parentId: z.string().optional(),
  });

  try {
    const body = await request.json();
    const data = schema.parse(body);

    const newComment = await prisma.comment.create({
      data: {
        content: data.content,
        topicId: data.topicId,
        parentId: data.parentId,
        userId: session.user.id,
        status: 'VISIBLE',
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.format() }, { status: 400 });
    }
    return new Response('Internal server error', { status: 500 });
  }
}
