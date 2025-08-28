// FILE: app/api/admin/moderation/flagged/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function GET(req: Request) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || 'PENDING';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    if (type) {
      where.targetType = type;
    }
    if (status) {
      where.status = status;
    }
    
    // Fetch flagged content
    const flaggedItems = await prisma.moderationLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        // Include the user who is the target of the moderation
        targetUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Get total count
    const total = await prisma.moderationLog.count({ where });
    
    return NextResponse.json({
      success: true,
      data: {
        items: flaggedItems,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin Moderation Flagged API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flagged content' }, 
      { status: 500 }
    );
  }
}