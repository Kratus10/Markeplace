import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Delete the signal
    await prisma.tradingSignal.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Signal deleted successfully'
    });
  } catch (error) {
    console.error('Delete Signal API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete signal' }, 
      { status: 500 }
    );
  }
}