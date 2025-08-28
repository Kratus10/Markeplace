// Simple test API route to verify authentication
import { auth } from '@/lib/auth/minimal-auth-config';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    message: 'Authenticated successfully!',
    user: session.user
  });
}