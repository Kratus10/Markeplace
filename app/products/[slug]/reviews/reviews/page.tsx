import { prisma } from '@/lib/prisma';
import ReviewsList from '@/components/product/ReviewsList';
import { notFound } from 'next/navigation';

export default async function ProductReviewsPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { slug } = params;
  
  try {
    // First find the product by slug to get its ID
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return notFound();
    }

    // Fetch reviews for the product directly from the database
    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        status: 'APPROVED',
      },
      select: {
        id: true,
        userId: true,
        rating: true,
        body: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format to match APIReview interface
    const apiReviews = reviews.map(review => ({
      ...review,
      verifiedPurchase: false, // This would need to be determined based on actual purchase data
      attachments: null,
    }));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Customer Reviews</h1>
        <ReviewsList reviews={apiReviews} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return notFound();
  }
}
