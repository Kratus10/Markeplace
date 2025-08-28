import { NextResponse } from 'next/server';
import { verifyAndConsumeToken } from '@/lib/email/tokens';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return new NextResponse('Token is required', { status: 400 });
    }
    
    const tokenRecord = await verifyAndConsumeToken(token, 'VERIFY_EMAIL');
    
    if (!tokenRecord) {
      return new NextResponse('Invalid or expired token', { status: 400 });
    }
    
    // Update user's email verification status
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailVerified: new Date() }
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Email verification error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
