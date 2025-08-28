
import { NextResponse } from 'next/server';

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

// GET all overrides
export async function GET() {
  return NextResponse.json(mockOverrides);
}

// POST a new override
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOverride = {
      id: (mockOverrides.length + 1).toString(),
      ...body,
    };
    mockOverrides.push(newOverride);
    return NextResponse.json(newOverride, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating override', error }, { status: 500 });
  }
}
