import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function subscriptionMiddleware(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user is admin (admins should have access to everything)
  const isAdmin = session.user.role === 'ADMIN_L1' || 
                  session.user.role === 'ADMIN_L2' || 
                  session.user.role === 'OWNER';
  
  if (isAdmin) {
    return null; // Allow admin to proceed
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
      }
    });
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 });
    }
    
    return null; // Allow request to proceed
  } catch (error) {
    console.error('Subscription validation error:', error);
    return NextResponse.json({ error: 'Failed to validate subscription' }, { status: 500 });
  }
}