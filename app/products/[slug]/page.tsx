"use client";

import React from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import ReviewsSummary from '@/components/product/ReviewsSummary';
import ReviewsList from '@/components/product/ReviewsList';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  mainImage: string;
  galleryImages: string[];
  features: string[];
  specifications: { key: string; value: string }[];
  relatedProducts: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  }[];
}

const getProductData = (slug: string): Product | null => {
  const products = [
    { 
      id: 'prod-123', 
      slug: 'premium-trading-indicator',
      name: 'Premium Trading Indicator', 
      description: 'Advanced algorithmic indicator for price action analysis', 
      longDescription: 'This premium trading indicator uses proprietary algorithms to analyze price action and identify high-probability trade setups. Designed for both novice and experienced traders, it provides clear visual signals on your charts with customizable parameters to fit your trading style. Works with MT4 and MT5 platforms.',
      price: 29.99,
      rating: 4.8,
      reviewCount: 124,
      mainImage: '/assets/indicator-preview-large.png',
      galleryImages: [
        '/assets/indicator-detail1.png',
        '/assets/indicator-detail2.png',
        '/assets/indicator-detail3.png',
      ],
      features: [
        'Real-time price action analysis',
        'Customizable sensitivity settings',
        'Multi-timeframe compatibility',
        'Clear visual buy/sell signals',
        'Risk management indicators'
      ],
      specifications: [
        { key: 'Compatibility', value: 'MT4, MT5' },
        { key: 'Version', value: '3.2.1' },
        { key: 'Updated', value: 'August 15, 2025' },
        { key: 'File Type', value: '.ex4' },
        { key: 'License Type', value: 'Single User' }
      ],
      reviews: [
        {
          id: 'rev-1',
          user: 'TraderJohn',
          rating: 5,
          comment: 'This indicator has transformed my trading strategy. The signals are clear and accurate.',
          date: '2025-07-20'
        },
        {
          id: 'rev-2',
          user: 'CryptoQueen',
          rating: 4,
          comment: 'Great tool for beginners, helped me understand market structure better.',
          date: '2025-07-15'
        }
      ],
      relatedProducts: [
        {
          id: 'prod-124', 
          name: 'Advanced Trading Bot', 
          price: 99.99,
          image: '/assets/ea-preview.png',
          slug: 'advanced-trading-bot'
        },
        {
          id: 'prod-125', 
          name: 'Basic Scalping Script', 
          price: 49.99,
          image: '/assets/script-preview.png',
          slug: 'basic-scalping-script'
        }
      ]
    }
  ];
  
  return products.find(p => p.slug === slug) || null;
};

const ProductDetailPage = ({ params }: { params: { slug: string } }) => {
  const product = getProductData(params.slug);
  
  const handleAddToCart = () => {
    console.log('Added to cart');
    alert('Added to cart! This would open the checkout flow in a real application');
  };

  const handleDownloadDemo = () => {
    console.log('Download demo');
    alert('Downloading demo... This would start a download in a real application');
  };
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="relative h-96 w-full rounded-xl overflow-hidden mb-4">
            <Image 
              src={product.mainImage} 
              alt={product.name} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {product.galleryImages.map((image, index) => (
              <div key={index} className="relative h-32 rounded-md overflow-hidden">
                <Image 
                  src={image} 
                  alt={`${product.name} detail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <span className="text-yellow-500 mr-1">{"★".repeat(Math.floor(product.rating))}</span>
              <span className="ml-1 text-gray-600">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({product.reviewCount} reviews)</span>
          </div>
          
          <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
          
          <p className="mb-6">{product.description}</p>
          
          <div className="flex gap-3 mb-8">
            <Button variant="primary" size="lg" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" onClick={handleDownloadDemo}>
              Download Demo
            </Button>
          </div>
          
          <div className="border-t border-b py-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="grid grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Specifications</h3>
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 font-medium">{spec.key}</td>
                    <td className="py-2 px-4">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12 mb-16">
        <h3 className="text-2xl font-bold mb-4">Description</h3>
        <p className="text-gray-700 mb-6">{product.longDescription}</p>
        
        <div className="prose max-w-none">
          <p>Our premium trading indicator is designed to give you an edge in the markets by identifying high-probability trade setups based on advanced price action analysis. Developed by professional traders with over 15 years of experience, this indicator combines multiple technical analysis concepts into a single, easy-to-use tool.</p>
          
          <p><strong>Key Benefits:</strong></p>
          <ul>
            <li>Identifies trend direction and potential reversal points</li>
            <li>Provides clear entry and exit signals</li>
            <li>Includes built-in risk management features</li>
            <li>Works across multiple asset classes (forex, stocks, crypto)</li>
            <li>Saves time on market analysis</li>
          </ul>
          
          <p>Whether you're a day trader, swing trader, or long-term investor, this indicator can help you make more informed trading decisions with confidence.</p>
        </div>
      </div>
      
      {/* Reviews */}
      <div className="mb-16">
        <ReviewsSummary 
          productId={product.id}
          averageRating={product.rating}
          reviewCount={product.reviewCount}
        />
        <ReviewsList productId={product.id} />
      </div>
      
      {/* Related Products */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {product.relatedProducts.map(related => (
            <ProductCard
              key={related.id}
              id={related.id}
              name={related.name}
              description=""
              price={related.price}
              rating={4.7}
              reviewCount={32}
              image={related.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
