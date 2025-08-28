import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1' && session.user.role !== 'ADMIN_L2')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const { id, type } = await request.json();

    if (!action || !id || !type) {
      return new Response('Missing required parameters', { status: 400 });
    }

    let result;
    
    switch (action) {
      case 'hide':
        if (type === 'topic') {
          result = await prisma.topic.update({
            where: { id },
            data: { status: 'HIDDEN_BY_MOD' }
          });
        } else if (type === 'comment') {
          result = await prisma.comment.update({
            where: { id },
            data: { status: 'HIDDEN_BY_MOD' }
          });
        }
        break;
        
      case 'quarantine':
        if (type === 'topic') {
          result = await prisma.topic.update({
            where: { id },
            data: { status: 'QUARANTINED' }
          });
        } else if (type === 'comment') {
          result = await prisma.comment.update({
            where: { id },
            data: { status: 'QUARANTINED' }
          });
        }
        break;
        
      case 'approve':
        if (type === 'topic') {
          result = await prisma.topic.update({
            where: { id },
            data: { status: 'VISIBLE' }
          });
        } else if (type === 'comment') {
          result = await prisma.comment.update({
            where: { id },
            data: { status: 'VISIBLE' }
          });
        }
        break;
        
      default:
        return new Response('Invalid action', { status: 400 });
    }

    // Log moderation action
    await prisma.moderationLog.create({
      data: {
        moderatorId: session.user.id,
        targetType: type,
        targetId: id,
        action: action.toUpperCase(),
        reason: `Moderator action via admin panel`
      }
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error performing moderation action:', error);
    return new Response('Internal server error', { status: 500 });
  }
}