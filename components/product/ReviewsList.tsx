'use client';

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';

type Attachment = {
  id: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  size: number;
};

interface APIReview {
  id: string;
  userId: string;
  rating: number;
  body: string;
  createdAt: string | Date;
  verifiedPurchase: boolean;
  attachments?: Attachment[] | null;
}

interface ReviewsListProps {
  productId?: string;           // optional: used to fetch when reviews not provided
  reviews?: APIReview[];
  loading?: boolean;
  error?: string;
}

export default function ReviewsList({
  productId,
  reviews: initialReviews = [],
  loading: initialLoading = false,
  error: initialError = '',
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<APIReview[]>(initialReviews);
  const [loading, setLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<string>(initialError);

  useEffect(() => {
    // If reviews were passed in, don't fetch. If not and we have a productId, fetch from serverless API.
    if (initialReviews?.length) return;
    if (!productId) return;

    let mounted = true;
    async function fetchReviews() {
      setLoading(true);
      try {
    const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId!)}`);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data: APIReview[] = await res.json();
        if (!mounted) return;
        // Normalize createdAt to Date if needed
        const normalized = data.map(r => ({ ...r, createdAt: typeof r.createdAt === 'string' ? new Date(r.createdAt) : r.createdAt }));
        setReviews(normalized);
      } catch (err: any) {
        setError(err?.message || 'Failed to load reviews');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchReviews();
    return () => { mounted = false; };
  }, [productId, initialReviews]);

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <p>Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to review this product
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
