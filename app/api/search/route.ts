import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    if (!q) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Search products using PostgreSQL full-text search
    const products = await prisma.$queryRaw`
      SELECT id, name, description, "ts_rank_cd"(
        to_tsvector('english', name || ' ' || description), 
        plainto_tsquery('english', ${q})
      ) as rank
      FROM "Product"
      WHERE to_tsvector('english', name || ' ' || description) @@ plainto_tsquery('english', ${q})
        AND status = 'PUBLISHED'
      ORDER BY rank DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Get total count for pagination
    const totalResults = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Product"
      WHERE to_tsvector('english', name || ' ' || description) @@ plainto_tsquery('english', ${q})
        AND status = 'PUBLISHED'
    `;

    return NextResponse.json({
      products,
      totalResults: totalResults[0]?.count || 0,
      page,
      totalPages: Math.ceil(totalResults[0]?.count / limit) || 1,
      limit
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
