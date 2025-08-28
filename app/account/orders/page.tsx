'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import { ShoppingBagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const OrderHistoryPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      // In a real app, you would fetch orders from an API
      // For now, we'll use mock data
      setTimeout(() => {
        setOrders([
          {
            id: 'ORD-001',
            date: '2023-05-15',
            total: 89.99,
            status: 'Delivered',
            items: 3,
          },
          {
            id: 'ORD-002',
            date: '2023-04-22',
            total: 149.50,
            status: 'Shipped',
            items: 5,
          },
          {
            id: 'ORD-003',
            date: '2023-03-10',
            total: 59.99,
            status: 'Delivered',
            items: 2,
          },
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [status, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-gray-400" />
        <p className="mt-2 text-gray-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <ShoppingBagIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium">Order #{order.id}</span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      {order.items} {order.items === 1 ? 'item' : 'items'} • {order.date}
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end space-x-6">
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBagIcon className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-gray-500">
                When you make your first purchase, it will appear here.
              </p>
              <Button className="mt-6">Start Shopping</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;