// Test API route for minimal auth
import { auth } from '@/lib/auth/minimal-auth-config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    return NextResponse.json({
      success: true,
      session: session || null,
      message: session ? 'Authenticated' : 'Not authenticated'
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}