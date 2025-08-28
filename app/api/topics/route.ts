// FILE: app/api/topics/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { moderateContent } from '@/lib/services/aiModerationService';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { categoryId, title, body } = await req.json();
    
    // Validate input
    if (!categoryId || !title || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Create topic
    const topic = await prisma.topic.create({
      data: {
        userId: session.user.id,
        categoryId,
        title,
        body
      }
    });
    
    // Run AI moderation on the content
    const moderationResult = await moderateContent(
      `${title} ${body}`, 
      session.user.id, 
      'TOPIC', 
      topic.id
    );
    
    return NextResponse.json({
      success: true,
      data: {
        topic,
        moderation: moderationResult
      }
    });
  } catch (error) {
    console.error('Topic creation API error:', error);
    return NextResponse.json(
      { error: 'Failed to create topic' }, 
      { status: 500 }
    );
  }
}