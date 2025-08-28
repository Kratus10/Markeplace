import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function adminMiddleware(req: Request) {
  const session = await getSession();
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Check if user has admin role
  const user = session.user;
  if (!user || (user.role !== 'ADMIN_L1' && user.role !== 'ADMIN_L2' && user.role !== 'OWNER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return null; // Allow request to proceed
}
