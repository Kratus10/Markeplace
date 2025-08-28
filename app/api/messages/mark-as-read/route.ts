import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const markAsReadSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = markAsReadSchema.safeParse(body);
    
    if (!validation.success) {
      return new NextResponse(JSON.stringify({ error: validation.error.issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messageId } = validation.data;

    // Check if user has an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        }
      }
    });

    if (!activeSubscription) {
      return new NextResponse('Only premium users can access messages', { status: 403 });
    }

    // Check if the message exists and belongs to the user
    const message = await prisma.message.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    if (message.receiverId !== session.user.id) {
      return new NextResponse('Unauthorized to mark this message as read', { status: 403 });
    }

    // Update the message as read
    const updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() }
    });

    return NextResponse.json({ ok: true, message: updatedMessage });
  } catch (error) {
    console.error('Error marking message as read:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}