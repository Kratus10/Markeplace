import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        // Add any filtering conditions as needed
      },
      orderBy: {
        order: 'asc' // Sort by the order field
      }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
