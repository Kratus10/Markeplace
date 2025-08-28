import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = params.productId;
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const filter = searchParams.get('filter') || 'all';

    // Calculate offset for pagination
    const skip = (page - 1) * limit;

    // Build where clause based on filter
    const whereClause: any = {
      productId,
      status: 'APPROVED'
    };

    if (filter === 'verified') {
      // For verified purchases, use relation filtering
      whereClause.order = {
        status: 'COMPLETED'
      };
    }

    // Get reviews with type-safe selection
    const reviews = await prisma.review.findMany({
      where: whereClause,
      select: {
        id: true,
        content: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        productId: true,
        status: true,
        ...(filter === 'verified' ? {
          order: {
            select: { 
              status: true
            }
          }
        } : {})
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Get total count for pagination
    const total = await prisma.review.count({
      where: whereClause,
    });

    // Calculate average rating
    const aggregations = await prisma.review.aggregate({
      where: whereClause,
      _avg: {
        rating: true
      },
      _count: {
        _all: true
      },
    });

    return NextResponse.json({
      data: reviews.map(review => ({
        ...review,
        // Attachments handling removed
        verifiedPurchase: filter === 'verified' 
          ? (review as any).order?.status === 'COMPLETED' 
          : false
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        averageRating: aggregations._avg.rating || 0,
        totalReviews: aggregations._count
      }
    });
  } catch (error) {
    console.error('[REVIEW_FETCH_ERROR]', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching reviews' },
      { status: 500 }
    );
  }
}
