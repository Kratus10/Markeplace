import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { calculateUserEarnings, createEarningsLedgerEntry, isUserPayoutEligible } from '@/lib/forum/earnings';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { userId, period } = await request.json();
    
    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }
    
    // Calculate earnings for the user
    const earningsData = await calculateUserEarnings(userId);
    
    // Check if user is eligible for payouts
    const isEligible = await isUserPayoutEligible(userId);
    
    if (!isEligible) {
      return NextResponse.json({
        success: true,
        message: 'User is not KYC verified and not eligible for payouts',
        earnings: earningsData,
        payoutEligible: false
      });
    }
    
    // Convert earnings to cents
    const totalCents = Math.round(earningsData.totalEarnings * 100);
    
    if (totalCents <= 0) {
      return NextResponse.json({
        success: true,
        message: 'No earnings to process',
        earnings: earningsData,
        payoutEligible: true
      });
    }
    
    // Create earnings ledger entry
    const ledgerEntry = await createEarningsLedgerEntry(userId, totalCents, 'FORUM_ENGAGEMENT');
    
    return NextResponse.json({
      success: true,
      message: 'Earnings calculated and ledger entry created',
      earnings: earningsData,
      payoutEligible: true,
      ledgerEntry
    });
  } catch (error) {
    console.error('Error calculating user earnings:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Get earnings summary for a user
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || session.user.id;
    
    // Only admins can view other users' earnings
    if (userId !== session.user.id && 
        session.user.role !== 'OWNER' && 
        session.user.role !== 'ADMIN_L1') {
      return new Response('Unauthorized', { status: 401 });
    }
    
    // Get earnings summary
    const earningsSummary = await prisma.earningsLedger.findMany({
      where: {
        userId,
        status: {
          not: 'CANCELLED'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Calculate total pending and paid amounts
    const pendingAmount = earningsSummary
      .filter(e => e.status === 'PENDING')
      .reduce((sum, e) => sum + e.amountCents, 0);
      
    const paidAmount = earningsSummary
      .filter(e => e.status === 'PAID')
      .reduce((sum, e) => sum + e.amountCents, 0);
    
    return NextResponse.json({
      earnings: earningsSummary,
      totals: {
        pending: pendingAmount,
        paid: paidAmount,
        total: pendingAmount + paidAmount
      }
    });
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return new Response('Internal server error', { status: 500 });
  }
}