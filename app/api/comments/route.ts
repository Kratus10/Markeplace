// FILE: app/api/comments/route.ts
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
    const { topicId, parentId, body } = await req.json();
    
    // Validate input
    if (!topicId || !body) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Create comment
    const comment = await prisma.comment.create({
      data: {
        topicId,
        userId: session.user.id,
        parentId,
        content: body
      }
    });
    
    // Run AI moderation on the content
    const moderationResult = await moderateContent(
      body, 
      session.user.id, 
      'COMMENT', 
      comment.id
    );
    
    return NextResponse.json({
      success: true,
      data: {
        comment,
        moderation: moderationResult
      }
    });
  } catch (error) {
    console.error('Comment creation API error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' }, 
      { status: 500 }
    );
  }
}