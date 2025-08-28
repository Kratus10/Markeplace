'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Order {
  id: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: string;
}

const OrderConfirmationPage = ({ params }: { params: { orderId: string } }) => {
  const router = useRouter();
  const orderId = params.orderId;

  // Mock order data for demo purposes
  const order: Order = {
    id: orderId,
    amount: 149.99,
    status: 'confirmed',
    items: [
      { id: 'prod123', name: 'Premium Trading Indicator', price: 99.99, quantity: 1 },
      { id: 'prod456', name: 'Expert Advisor Bot', price: 50, quantity: 1 },
    ],
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back
        </Button>

        <Card className="mb-8">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mt-4 mb-2">Order Confirmed!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order #{orderId} has been successfully placed.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div>${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-4 font-bold">
                  <div>Total</div>
                  <div>${order.amount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-medium mb-4">What's Next?</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  You'll receive an email with your license keys shortly.
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Download links are available in your account's Orders section.
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Need help? Visit our support page or contact us.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/marketplace">
            <Button variant="secondary">Continue Shopping</Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="primary">View My Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
