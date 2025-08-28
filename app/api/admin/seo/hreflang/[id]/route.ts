
import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a database.
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

// GET a single mapping by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const mapping = mockMappings.find((m) => m.id === id);

  if (!mapping) {
    return NextResponse.json({ message: 'Mapping not found' }, { status: 404 });
  }

  return NextResponse.json(mapping);
}

// PUT (update) a mapping by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    let mappingIndex = mockMappings.findIndex((m) => m.id === id);

    if (mappingIndex === -1) {
      return NextResponse.json({ message: 'Mapping not found' }, { status: 404 });
    }

    // Update the mapping
    mockMappings[mappingIndex] = { ...mockMappings[mappingIndex], ...body };

    return NextResponse.json(mockMappings[mappingIndex]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating mapping', error }, { status: 500 });
  }
}

// DELETE a mapping by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const initialLength = mockMappings.length;
  mockMappings = mockMappings.filter((m) => m.id !== id);

  if (mockMappings.length === initialLength) {
    return NextResponse.json({ message: 'Mapping not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Mapping deleted successfully' });
}
