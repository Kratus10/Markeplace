// FILE: app/api/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' }, 
      { status: 500 }
    );
  }
}