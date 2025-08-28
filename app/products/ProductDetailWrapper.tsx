"use client";

import React from 'react';
import type { Product } from './[slug]/page';
import Button from '@/components/ui/Button';

interface ProductDetailWrapperProps {
  product: Product;
  children: React.ReactNode;
}

const ProductDetailWrapper: React.FC<ProductDetailWrapperProps> = ({ product, children }) => {
  const handleAddToCart = () => {
    console.log('Added to cart');
  };

  const handleDownloadDemo = () => {
    console.log('Download demo');
  };

  return (
    <div>
      <div className="flex gap-3 mb-8">
        <Button variant="primary" size="lg" onClick={handleAddToCart}>
          Add to Cart
        </Button>
        <Button variant="outline" size="lg" onClick={handleDownloadDemo}>
          Download Demo
        </Button>
      </div>
      {children}
    </div>
  );
};

export default ProductDetailWrapper;
