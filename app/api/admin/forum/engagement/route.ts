import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1' && session.user.role !== 'ADMIN_L2')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days') || '30';
    const daysInt = parseInt(days);

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysInt);

    // Fetch user engagement data
    const userData = await prisma.user.findMany({
      where: {
        role: {
          not: 'OWNER'
        }
      },
      include: {
        _count: {
          select: {
            comments: true,
            topics: true
          }
        }
      }
    });

    // Fetch engagement events for the period
    const engagementEvents = await prisma.engagementEvent.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: true
      }
    });

    // Fetch earnings data
    const earningsData = await prisma.earningsLedger.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        status: {
          not: 'CANCELLED'
        }
      }
    });

    // Process data to calculate metrics
    const result = userData.map(user => {
      // Count likes and shares
      const userEngagements = engagementEvents.filter(e => e.userId === user.id);
      const likes = userEngagements.filter(e => e.type === 'LIKE').length;
      const shares = userEngagements.filter(e => e.type === 'SHARE').length;
      
      // Count comments
      const comments = user._count.comments || 0;
      
      // Calculate earnings
      const userEarnings = earningsData
        .filter(e => e.userId === user.id)
        .reduce((sum, e) => sum + e.amountCents, 0) / 100;
      
      // Calculate pending payouts
      const pendingEarnings = earningsData
        .filter(e => e.userId === user.id && e.status === 'PENDING')
        .reduce((sum, e) => sum + e.amountCents, 0) / 100;
      
      // Simple fraud scoring (in a real implementation, this would be more complex)
      let fraudScore = 0;
      if (comments > 100) fraudScore += 10; // High comment volume
      if (likes > 1000) fraudScore += 15; // High like volume
      if (shares > 100) fraudScore += 5; // High share volume
      if (userEarnings > 100) fraudScore += 20; // High earnings
      
      // Status based on earnings and fraud score
      let status: 'ACTIVE' | 'HELD_FOR_REVIEW' | 'PAID' = 'ACTIVE';
      if (fraudScore > 50) {
        status = 'HELD_FOR_REVIEW';
      }

      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email || '',
        kycVerified: user.kycVerified || false,
        totalLikes: likes,
        totalReplies: comments,
        totalEarnings: userEarnings,
        pendingPayout: pendingEarnings,
        fraudScore,
        status
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching engagement data:', error);
    return new Response('Internal server error', { status: 500 });
  }
}