
import { NextResponse } from 'next/server';

let mockSettings = {
  enable: true,
  splitSize: 50000,
  pingSearchEngines: true,
};

export async function GET() {
  return NextResponse.json(mockSettings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    mockSettings = { ...mockSettings, ...body };
    return NextResponse.json(mockSettings);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating settings', error }, { status: 500 });
  }
}
