
import { NextResponse } from 'next/server';

// This is a mock database. In a real application, you would use a database.
let mockTemplates = [
  {
    id: '1',
    name: 'Default Template',
    template: '<div><h1>{{title}}</h1><p>{{description}}</p></div>',
  },
  {
    id: '2',
    name: 'Sale Template',
    template: '<div style="background:red;color:white"><h1>{{title}}</h1></div>',
  },
];

// GET a single template by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const template = mockTemplates.find((t) => t.id === id);

  if (!template) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json(template);
}

// PUT (update) a template by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await request.json();
    let templateIndex = mockTemplates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      return NextResponse.json({ message: 'Template not found' }, { status: 404 });
    }

    // Update the template
    mockTemplates[templateIndex] = { ...mockTemplates[templateIndex], ...body };

    return NextResponse.json(mockTemplates[templateIndex]);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating template', error }, { status: 500 });
  }
}

// DELETE a template by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const initialLength = mockTemplates.length;
  mockTemplates = mockTemplates.filter((t) => t.id !== id);

  if (mockTemplates.length === initialLength) {
    return NextResponse.json({ message: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Template deleted successfully' });
}
