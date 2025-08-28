// FILE: app/api/subscriptions/cancel/route.ts
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
    // Find user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      }
    });
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' }, 
        { status: 404 }
      );
    }
    
    // Update subscription to cancel auto-renew
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        autoRenew: false
      }
    });
    
    return NextResponse.json({
      success: true,
      data: updatedSubscription,
      message: 'Subscription auto-renew has been canceled'
    });
  } catch (error) {
    console.error('Cancel subscription API error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' }, 
      { status: 500 }
    );
  }
}