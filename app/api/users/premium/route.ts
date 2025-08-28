import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Check if current user has an active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(),
        }
      }
    });

    if (!activeSubscription) {
      return new NextResponse('Only premium users can access this feature', { status: 403 });
    }

    // Get all users with active subscriptions
    const usersWithSubscriptions = await prisma.user.findMany({
      where: {
        subscriptions: {
          some: {
            status: 'ACTIVE',
            endDate: {
              gte: new Date(),
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      }
    });

    // Filter out the current user
    const users = usersWithSubscriptions.filter(user => user.id !== session.user.id);

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error('Error fetching premium users:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}