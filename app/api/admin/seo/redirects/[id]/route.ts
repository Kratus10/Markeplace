
import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a database.
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

// GET a single redirect by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const redirect = mockRedirects.find((r) => r.id === id);

  if (!redirect) {
    return NextResponse.json({ message: 'Redirect not found' }, { status: 404 });
  }

  return NextResponse.json(redirect);
}

// PUT (update) a redirect by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    let redirectIndex = mockRedirects.findIndex((r) => r.id === id);

    if (redirectIndex === -1) {
      return NextResponse.json({ message: 'Redirect not found' }, { status: 404 });
    }

    // Update the redirect
    mockRedirects[redirectIndex] = { ...mockRedirects[redirectIndex], ...body };

    return NextResponse.json(mockRedirects[redirectIndex]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating redirect', error }, { status: 500 });
  }
}

// DELETE a redirect by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const initialLength = mockRedirects.length;
  mockRedirects = mockRedirects.filter((r) => r.id !== id);

  if (mockRedirects.length === initialLength) {
    return NextResponse.json({ message: 'Redirect not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Redirect deleted successfully' });
}
