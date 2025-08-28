import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has proper role
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Only OWNER and ADMIN_L1 can manage featured topics
  if (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { topicId, isPinned } = await request.json();
    
    // Validate input
    if (!topicId) {
      return NextResponse.json(
        { error: 'Missing topic ID' }, 
        { status: 400 }
      );
    }
    
    // Update topic pin status
    const updatedTopic = await prisma.topic.update({
      where: {
        id: topicId
      },
      data: {
        isPinned: isPinned
      }
    });
    
    return NextResponse.json({
      success: true,
      topic: updatedTopic
    });
  } catch (error) {
    console.error('Error updating topic pin status:', error);
    return NextResponse.json(
      { error: 'Failed to update topic' }, 
      { status: 500 }
    );
  }
}