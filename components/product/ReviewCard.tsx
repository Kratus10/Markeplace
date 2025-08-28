import { StarIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import type { Review } from '@prisma/client';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Get initials for anonymous user
  const userInitials = review.anonymous ? 'A' : review.userId.charAt(0).toUpperCase();
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-medium">{userInitials}</span>
          </div>
        </div>
        <div className="ml-4">
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((rating) => (
                <StarIcon
                  key={rating}
                  className={`h-5 w-5 ${
                    rating <= review.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="ml-2 text-sm font-medium text-gray-900">
              {review.anonymous ? 'Anonymous' : `User ${review.userId.substring(0, 4)}`}
            </p>
          </div>
          
          {review.verifiedPurchase && (
            <p className="mt-1 text-xs text-indigo-600">
              Verified Purchase
            </p>
          )}
          
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(review.createdAt), 'MMMM d, yyyy')}
          </p>
          
          {review.title && (
            <h3 className="mt-2 text-base font-medium text-gray-900">
              {review.title}
            </h3>
          )}
          
          <div 
            className="mt-2 text-sm text-gray-600 prose" 
            dangerouslySetInnerHTML={{ __html: review.bodyHtml }} 
          />
        </div>
      </div>
    </div>
  );
}
