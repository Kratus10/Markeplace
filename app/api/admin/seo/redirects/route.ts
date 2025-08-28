
import { NextResponse } from 'next/server';

let mockRedirects = [
  {
    id: '1',
    source: '/old-about-page',
    destination: '/about',
    permanent: true,
  },
  {
    id: '2',
    source: '/promo/old-sale',
    destination: '/sales',
    permanent: false,
  },
];

export async function GET() {
  return NextResponse.json(mockRedirects);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newRedirect = {
      id: (mockRedirects.length + 1).toString(),
      ...body,
    };
    mockRedirects.push(newRedirect);
    return NextResponse.json(newRedirect, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating redirect', error }, { status: 500 });
  }
}
