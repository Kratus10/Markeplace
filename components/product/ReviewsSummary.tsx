import { StarIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface ReviewsSummaryProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export default function ReviewsSummary({ 
  productId, 
  averageRating, 
  reviewCount 
}: ReviewsSummaryProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <StarIcon
              key={rating}
              className={`h-5 w-5 ${
                rating <= Math.round(averageRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="ml-2 text-sm text-gray-500">
          {averageRating.toFixed(1)} out of 5
        </p>
      </div>
      <p className="text-sm text-gray-500">
        {reviewCount} review{reviewCount === 1 ? '' : 's'}
      </p>
      <Link 
        href={`/product/${productId}/reviews`}
        className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        Read all reviews
      </Link>
    </div>
  );
}
