
import { NextResponse } from 'next/server';

let mockMappings = [
  {
    id: '1',
    identifier: 'product-123',
    mappings: [
      { lang: 'en-US', href: 'https://example.com/us/products/123' },
      { lang: 'en-GB', href: 'https://example.com/gb/products/123' },
      { lang: 'de-DE', href: 'https://example.com/de/products/123' },
    ],
  },
  {
    id: '2',
    identifier: 'about-page',
    mappings: [
      { lang: 'en', href: 'https://example.com/about' },
      { lang: 'es', href: 'https://example.com/es/acerca' },
    ],
  },
];

export async function GET() {
  return NextResponse.json(mockMappings);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newMapping = {
      id: (mockMappings.length + 1).toString(),
      ...body,
    };
    mockMappings.push(newMapping);
    return NextResponse.json(newMapping, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating mapping', error }, { status: 500 });
  }
}
