import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a database.
let mockOverrides = [
  {
    id: '1',
    pagePath: '/about',
    title: 'About Us - Custom Title',
    description: 'This is a custom description for the about page.',
    keywords: 'about us, custom, seo',
  },
  {
    id: '2',
    pagePath: '/contact',
    title: 'Contact Us - Reach Out',
    description: null,
    keywords: 'contact, support, help',
  },
];

// GET a single override by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const override = mockOverrides.find((o) => o.id === id);

  if (!override) {
    return NextResponse.json({ message: 'Override not found' }, { status: 404 });
  }

  return NextResponse.json(override);
}

// PUT (update) an override by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    let overrideIndex = mockOverrides.findIndex((o) => o.id === id);

    if (overrideIndex === -1) {
      return NextResponse.json({ message: 'Override not found' }, { status: 404 });
    }

    // Update the override
    mockOverrides[overrideIndex] = { ...mockOverrides[overrideIndex], ...body };

    return NextResponse.json(mockOverrides[overrideIndex]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating override', error }, { status: 500 });
  }
}

// DELETE an override by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const initialLength = mockOverrides.length;
  mockOverrides = mockOverrides.filter((o) => o.id !== id);

  if (mockOverrides.length === initialLength) {
    return NextResponse.json({ message: 'Override not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Override deleted successfully' });
}