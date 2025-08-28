
import { NextResponse } from 'next/server';

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

export async function GET() {
  return NextResponse.json(mockTemplates);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTemplate = {
      id: (mockTemplates.length + 1).toString(),
      ...body,
    };
    mockTemplates.push(newTemplate);
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating template', error }, { status: 500 });
  }
}
