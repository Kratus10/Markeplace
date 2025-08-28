import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth/authOptions';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug auth route called');
    const session = await getServerSession(authOptions);
    console.log('Session in debug route:', session);
    
    return NextResponse.json({
      session,
      message: session ? 'Authenticated' : 'Not authenticated'
    });
  } catch (error) {
    console.error('Error in debug auth route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}