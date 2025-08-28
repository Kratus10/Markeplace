// FILE: app/api/user/subscription-status/route.ts
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
    // Check if user has an active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      },
      orderBy: {
        endDate: 'desc'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        isSubscribed: !!subscription,
        subscription: subscription ? {
          id: subscription.id,
          planType: subscription.planType,
          status: subscription.status,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate.toISOString(),
          autoRenew: subscription.autoRenew,
          createdAt: subscription.createdAt.toISOString()
        } : null
      }
    });
  } catch (error) {
    console.error('Subscription status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' }, 
      { status: 500 }
    );
  }
}