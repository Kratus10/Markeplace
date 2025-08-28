import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/authOptions';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { ROLES } from '@/lib/auth/roleUtils';

export default async function middleware(req: NextRequest) {
  // Handle authentication for all routes first
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Skip authentication for specific API routes
  if (req.nextUrl.pathname.startsWith('/api/user')) {
    return NextResponse.next();
  }
  
  // Handle admin route protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    console.log("Temporarily bypassing admin route protection for debugging.");
    return NextResponse.next();
  }
  
  // Continue with existing auth middleware for other protected routes
  // We need to cast req to any to satisfy NextAuth's type expectations
  return (auth as any)(req, {
    params: { nextauth: ["api", "auth"] }
  });
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile",
    "/messages",
    "/account/:path*",
    "/api/messages/:path*",
  ],
};
