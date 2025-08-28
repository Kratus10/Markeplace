import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/authOptions';

export async function GET() {
  try {
    // This is a simple test endpoint to verify authentication
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    
    return NextResponse.json({ 
      message: 'Authenticated', 
      user: session.user 
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ error: 'Authentication test failed' }, { status: 500 });
  }
}