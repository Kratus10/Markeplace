
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('--- DEBUG TOKEN API ---');
  console.log('Token:', token);
  console.log('--- END DEBUG TOKEN API ---');
  return NextResponse.json({ token });
}
