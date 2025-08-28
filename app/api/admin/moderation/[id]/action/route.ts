// FILE: app/api/admin/moderation/[id]/action/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    const { action, reason } = await req.json();
    
    // Validate action
    if (!['APPROVE', 'HIDE', 'DELETE', 'BAN_USER'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' }, 
        { status: 400 }
      );
    }
    
    // Get the moderation log entry
    const moderationLog = await prisma.moderationLog.findUnique({
      where: { id: params.id }
    });
    
    if (!moderationLog) {
      return NextResponse.json(
        { error: 'Moderation log entry not found' }, 
        { status: 404 }
      );
    }
    
    // Perform the action based on targetType
    switch (moderationLog.targetType) {
      case 'TOPIC':
        if (action === 'DELETE') {
          await prisma.topic.update({
            where: { id: moderationLog.targetId },
            data: { status: 'HIDDEN_BY_MOD' }
          });
        } else if (action === 'HIDE') {
          await prisma.topic.update({
            where: { id: moderationLog.targetId },
            data: { status: 'QUARANTINED' }
          });
        } else if (action === 'APPROVE') {
          await prisma.topic.update({
            where: { id: moderationLog.targetId },
            data: { status: 'VISIBLE' }
          });
        }
        break;
        
      case 'COMMENT':
        if (action === 'DELETE') {
          await prisma.comment.update({
            where: { id: moderationLog.targetId },
            data: { status: 'HIDDEN_BY_MOD' }
          });
        } else if (action === 'HIDE') {
          await prisma.comment.update({
            where: { id: moderationLog.targetId },
            data: { status: 'QUARANTINED' }
          });
        } else if (action === 'APPROVE') {
          await prisma.comment.update({
            where: { id: moderationLog.targetId },
            data: { status: 'VISIBLE' }
          });
        }
        break;
        
      case 'USER':
        if (action === 'BAN_USER') {
          await prisma.user.update({
            where: { id: moderationLog.targetId },
            data: { status: 'BANNED' }
          });
        }
        break;
    }
    
    // Update the moderation log
    const updatedLog = await prisma.moderationLog.update({
      where: { id: params.id },
      data: {
        action,
        reason,
        moderatorId: session?.user.id,
        status: 'RESOLVED'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedLog
    });
  } catch (error) {
    console.error('Admin Moderation Action API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform moderation action' }, 
      { status: 500 }
    );
  }
}