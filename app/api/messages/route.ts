// FILE: app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { subscriptionMiddleware } from '@/lib/middleware/subscriptionMiddleware';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const isPremium = searchParams.get('isPremium') === 'true';
    
    // If requesting premium messages, validate subscription
    if (isPremium) {
      const subscriptionResponse = await subscriptionMiddleware(req);
      if (subscriptionResponse) {
        return subscriptionResponse;
      }
    }
    
    // Get messages for the user
    const messages = await prisma.message.findMany({
      where: {
        receiverId: session.user.id,
        isPremium: isPremium || undefined
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    });
    
    // Get total count for pagination
    const totalCount = await prisma.message.count({
      where: {
        receiverId: session.user.id,
        isPremium: isPremium || undefined
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        messages: messages.map(message => ({
          id: message.id,
          sender: {
            name: message.sender.name,
            email: message.sender.email,
            image: message.sender.image
          },
          content: message.content,
          isPremium: message.isPremium,
          readAt: message.readAt,
          createdAt: message.createdAt
        })),
        pagination: {
          total: totalCount,
          limit,
          offset
        }
      }
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { receiverId, subject, content, isPremium } = await req.json();
    
    // Validate input
    if (!receiverId || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // If sending premium message, validate subscription
    if (isPremium) {
      const subscriptionResponse = await subscriptionMiddleware(req);
      if (subscriptionResponse) {
        return subscriptionResponse;
      }
    }
    
    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId,
        subject,
        content,
        isPremium: isPremium || false
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        content: message.content,
        isPremium: message.isPremium,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Send Message API error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' }, 
      { status: 500 }
    );
  }
}