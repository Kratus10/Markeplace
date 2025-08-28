import { prisma } from '@/lib/prisma';

// Calculate earnings for a user based on engagement
export async function calculateUserEarnings(userId: string, startDate?: Date, endDate?: Date) {
  // Default to last 30 days if no dates provided
  const now = new Date();
  const defaultStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const actualStartDate = startDate || defaultStartDate;
  const actualEndDate = endDate || now;
  
  // Get engagement events for the user in the specified period
  const engagementEvents = await prisma.engagementEvent.findMany({
    where: {
      userId,
      createdAt: {
        gte: actualStartDate,
        lte: actualEndDate
      }
    }
  });
  
  // Count likes and shares
  const likes = engagementEvents.filter(e => e.type === 'LIKE').length;
  const shares = engagementEvents.filter(e => e.type === 'SHARE').length;
  
  // Get comments for the user in the specified period
  const comments = await prisma.comment.count({
    where: {
      userId,
      createdAt: {
        gte: actualStartDate,
        lte: actualEndDate
      }
    }
  });
  
  // Calculate earnings based on the monetization rules
  // $0.50 per 1,000 likes
  const likeEarnings = Math.floor(likes / 1000) * 0.50;
  
  // $0.50 per 200 replies
  const replyEarnings = Math.floor(comments / 200) * 0.50;
  
  // $0.50 per 1,000 shares (comments don't have shares, but topics do)
  const shareEarnings = Math.floor(shares / 1000) * 0.50;
  
  const totalEarnings = likeEarnings + replyEarnings + shareEarnings;
  
  return {
    likes,
    comments,
    shares,
    likeEarnings,
    replyEarnings,
    shareEarnings,
    totalEarnings
  };
}

// Create earnings ledger entry
export async function createEarningsLedgerEntry(userId: string, amountCents: number, type: string) {
  return await prisma.earningsLedger.create({
    data: {
      userId,
      amountCents,
      type,
      status: 'PENDING'
    }
  });
}

// Check if user is eligible for payouts (KYC verified)
export async function isUserPayoutEligible(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  return user?.kycVerified || false;
}