import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id,
  name,
  description,
  price,
  rating,
  reviewCount,
  image
}) => {
  // Generate stars based on rating
  const stars = Array.from({ length: 5 }, (_, i) => (
    <svg 
      key={i} 
      className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image 
          src={image} 
          alt={name} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-5">
        <Link href={`/product/${id}`}>
          <h3 className="text-lg font-bold mb-1 text-gray-900 hover:text-blue-600">{name}</h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {stars}
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-600">{reviewCount} reviews</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">${price.toFixed(2)}</span>
          </div>
          <Button variant="primary" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
