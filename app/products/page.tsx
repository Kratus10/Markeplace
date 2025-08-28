import { getProducts } from '@/lib/products/helpers';
import Link from 'next/link';

export default async function ProductsPage() {
  const products = await getProducts(); // Will implement this function later

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trading Tools & Resources</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <Link 
            href={`/products/${product.id}`} 
            key={product.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-4" />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-3">{product.shortDescription}</p>
              <div className="flex justify-between items-center">
                <span className="text-primary-600 font-bold">${product.price}</span>
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span>{product.rating || '4.5'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
