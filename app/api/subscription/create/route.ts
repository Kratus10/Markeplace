// FILE: app/api/subscription/create/route.ts
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
        { error: 'Invalid plan type. Must be "MONTHLY" or "YEARLY"' }, 
        { status: 400 }
      );
    }
    
    // Calculate amount and duration
    let amountCents = 0;
    let durationMonths = 0;
    
    if (planType === 'MONTHLY') {
      amountCents = 500; // $5.00
      durationMonths = 1;
    } else if (planType === 'YEARLY') {
      amountCents = 4800; // $48.00 for 12 months ($4/month)
      durationMonths = 12;
    }
    
    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      }
    });
    
    if (existingSubscription) {
      return NextResponse.json(
        { error: 'You already have an active subscription' }, 
        { status: 400 }
      );
    }
    
    // Create subscription
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationMonths);
    
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
    
    // Create order for the subscription
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        productId: 'subscription_' + planType.toLowerCase(), // Special product ID for subscriptions
        amountCents,
        currency: 'USD',
        status: 'PENDING',
        subscriptionId: subscription.id
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        orderId: order.id,
        amountCents,
        planType,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString()
      }
    });
  } catch (error) {
    console.error('Subscription creation API error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' }, 
      { status: 500 }
    );
  }
}