import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/components/product/ProductCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

const MarketplacePage = () => {
  // Sample product data - in a real app this would come from an API
  const products = [
    { 
      id: 'prod-123', 
      name: 'Premium Trading Indicator', 
      description: 'Advanced algorithmic indicator for price action analysis', 
      price: 29.99,
      rating: 4.8,
      reviewCount: 124,
      image: '/assets/indicator-preview.png'
    },
    { 
      id: 'prod-456', 
      name: 'Expert Advisor PRO', 
      description: 'Fully automated trading solution with risk management', 
      price: 99.99,
      rating: 4.9,
      reviewCount: 87,
      image: '/assets/ea-preview.png'
    },
    { 
      id: 'prod-789', 
      name: 'Script Bundle', 
      description: 'Collection of 10 utility scripts for MT5 platform', 
      price: 49.99,
      rating: 4.6,
      reviewCount: 56,
      image: '/assets/script-preview.png'
    },
    { 
      id: 'prod-101', 
      name: 'Crypto Trading Signals', 
      description: 'Daily cryptocurrency trading signals with analysis', 
      price: 19.99,
      rating: 4.5,
      reviewCount: 203,
      image: '/assets/signals-preview.png'
    },
    { 
      id: 'prod-202', 
      name: 'Market Analysis Toolkit', 
      description: 'Comprehensive technical analysis tools and indicators', 
      price: 79.99,
      rating: 4.7,
      reviewCount: 42,
      image: '/assets/toolkit-preview.png'
    },
    { 
      id: 'prod-303', 
      name: 'Beginner Trading Course', 
      description: 'Step-by-step guide to Forex and crypto trading', 
      price: 149.99,
      rating: 4.9,
      reviewCount: 321,
      image: '/assets/course-preview.png'
    },
  ];

  // Categories and filters
  const categories = [
    { id: 'indicators', name: 'Indicators' },
    { id: 'eas', name: 'Expert Advisors' },
    { id: 'scripts', name: 'Scripts' },
    { id: 'courses', name: 'Courses' },
    { id: 'signals', name: 'Signals' },
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover premium trading tools, indicators, EAs, scripts, and educational resources to enhance your trading strategy
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <Input
              id="search"
              placeholder="Search for products..."
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              fullWidth
            />
          </div>
          <div className="md:col-span-3">
            <Select 
              id="category"
              options={categories.map(c => ({ value: c.id, label: c.name }))}
              placeholder="All Categories"
              fullWidth
            />
          </div>
          <div className="md:col-span-3 flex gap-2">
            <Select 
              id="sort"
              options={sortOptions}
              placeholder="Sort by"
              fullWidth
            />
            <Button variant="outline" className="whitespace-nowrap">
              <FunnelIcon className="h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            rating={product.rating}
            reviewCount={product.reviewCount}
            image={product.image}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" disabled className="opacity-50">
            Previous
          </Button>
          <Button variant="primary">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <span className="px-4">...</span>
          <Button variant="outline">8</Button>
          <Button variant="outline">Next</Button>
        </nav>
      </div>
    </div>
  );
};

export default MarketplacePage;
