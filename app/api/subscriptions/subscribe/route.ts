// FILE: app/api/subscriptions/subscribe/route.ts
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
    const { planType } = await req.json();
    
    // Validate plan type
    if (!planType || (planType !== 'MONTHLY' && planType !== 'YEARLY')) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be MONTHLY or YEARLY' }, 
        { status: 400 }
      );
    }
    
    // Get plan prices from environment variables
    const monthlyPrice = parseInt(process.env.DEFAULT_SUBSCRIPTION_MONTHLY_CENTS || '500');
    const yearlyPrice = parseInt(process.env.DEFAULT_SUBSCRIPTION_YEARLY_CENTS || '4800');
    
    // Calculate price based on plan
    const priceInCents = planType === 'MONTHLY' ? monthlyPrice : yearlyPrice;
    
    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    
    if (planType === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planType,
        status: 'ACTIVE',
        startDate,
        endDate,
        autoRenew: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: subscription,
      message: 'Subscription created successfully'
    });
  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' }, 
      { status: 500 }
    );
  }
}