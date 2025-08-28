// FILE: app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { targetType, targetId, reason, details } = await req.json();
    
    // Validate input
    if (!targetType || !targetId || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Validate targetType
    if (!['TOPIC', 'COMMENT', 'USER', 'MESSAGE'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid target type' }, 
        { status: 400 }
      );
    }
    
    // Create moderation log entry
    const report = await prisma.moderationLog.create({
      data: {
        targetType,
        targetId,
        action: 'REPORT',
        reason,
        status: 'PENDING',
        user: {
          connect: {
            id: session.user.id
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Report API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' }, 
      { status: 500 }
    );
  }
}