import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || session.user.role !== 'OWNER') {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { userId, earningsId } = await request.json();
    
    if (!userId && !earningsId) {
      return new Response('User ID or Earnings ID is required', { status: 400 });
    }
    
    let earningsRecord;
    
    // If earningsId is provided, process that specific record
    if (earningsId) {
      earningsRecord = await prisma.earningsLedger.findUnique({
        where: { id: earningsId }
      });
      
      if (!earningsRecord) {
        return new Response('Earnings record not found', { status: 404 });
      }
      
      if (earningsRecord.userId !== userId) {
        return new Response('User ID mismatch', { status: 400 });
      }
    } 
    // If only userId is provided, process all pending earnings for that user
    else {
      const pendingEarnings = await prisma.earningsLedger.findMany({
        where: {
          userId,
          status: 'PENDING'
        }
      });
      
      if (pendingEarnings.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No pending earnings to process'
        });
      }
      
      // Sum up all pending earnings
      const totalCents = pendingEarnings.reduce((sum, e) => sum + e.amountCents, 0);
      
      // Create a new consolidated earnings record
      earningsRecord = await prisma.earningsLedger.create({
        data: {
          userId,
          amountCents: totalCents,
          sourceType: 'FORUM_ENGAGEMENT_PAYOUT',
          sourceId: `payout-${Date.now()}`, // Generate a unique source ID
          status: 'PROCESSING'
        }
      });
      
      // Mark previous records as processed
      await prisma.earningsLedger.updateMany({
        where: {
          userId,
          status: 'PENDING',
          id: {
            not: earningsRecord.id
          }
        },
        data: {
          status: 'PROCESSED'
        }
      });
    }
    
    // In a real implementation, this would integrate with a payment provider
    // For now, we'll just mark it as paid
    
    // Update the earnings record status to PAID
    const updatedRecord = await prisma.earningsLedger.update({
      where: { id: earningsRecord.id },
      data: {
        status: 'PAID',
        updatedAt: new Date()
      }
    });
    
    // Log the payout in the audit log
    await prisma.auditLog.create({
      data: {
        action: 'PAYOUT_PROCESSED',
        entityId: userId,
        entityType: 'USER',
        entityName: `Payout to user ${userId}`,
        status: 'SUCCESS',
        details: JSON.stringify({
          earningsId: updatedRecord.id,
          amountCents: updatedRecord.amountCents,
          processedBy: session.user.id
        }),
        userId: session.user.id
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Payout processed successfully',
      earningsRecord: updatedRecord
    });
  } catch (error) {
    console.error('Error processing payout:', error);
    return new Response('Internal server error', { status: 500 });
  }
}