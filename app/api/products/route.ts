import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  try {
    if (slug) {
      // Fetch single product by slug
      const product = await prisma.product.findUnique({
        where: { slug },
        include: {
          reviews: {
            where: { status: 'APPROVED' },
            include: { user: true }
          }
        }
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(product);
    }

    // Fetch all products if no slug provided
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: { versions: true }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
