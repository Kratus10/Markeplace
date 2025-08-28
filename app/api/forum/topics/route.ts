import { NextResponse } from 'next/server';
import { auth, authOptions } from '@/lib/auth/authOptions';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const topicSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  body: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
});

export const runtime = "nodejs";

export async function GET() {
  try {
    const topics = await prisma.topic.findMany({
      where: {
        status: 'VISIBLE'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
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
      },
      take: 50
    });

    return NextResponse.json({ ok: true, topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = topicSchema.safeParse(body);
    
    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: validation.error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, body: content, categoryId, tags } = validation.data;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return new NextResponse('Invalid category', { status: 400 });
    }

    // Create the topic with ID
    const topicId = randomUUID().toLowerCase();
    const topic = await prisma.topic.create({
      data: {
        id: topicId,
        title,
        content: content,
        userId: session.user.id,
        categoryId,
        status: 'VISIBLE',
      },
  include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        category: {
          select: {
            name: true,
            color: true,
          }
        }
      }
    });

    return NextResponse.json({ ok: true, topic: { ...topic, id: topicId } });
  } catch (error) {
    console.error('Error creating topic:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
