// FILE: components/forum/CategoryList.tsx
'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string;
}

export default function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card key={category.id} className="p-4 hover:shadow-md transition-shadow">
          <Link href={`/forum/category/${category.slug}`} className="block">
            <div className="flex items-center mb-2">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {category.description}
            </p>
            <div className="text-xs text-gray-500">
              {/* In a real implementation, this would show the actual topic count */}
              {Math.floor(Math.random() * 50) + 1} topics
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}