'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCart from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select, { SelectProps } from '@/components/ui/Select';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'binance' | 'manual' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionProof, setTransactionProof] = useState<File | null>(null);
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT');
  const [cryptoAddress, setCryptoAddress] = useState('');

  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call to create order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful payment
      clearCart();
      
      // Redirect to order confirmation
      router.push('/order/12345');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6">Add some products before checking out.</p>
        <Link href="/marketplace">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card variant="outline" className="mb-6">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
              
              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="outline">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="binance"
                  name="payment"
                  checked={paymentMethod === 'binance'}
                  onChange={() => setPaymentMethod('binance')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="binance" className="ml-2 block text-sm font-medium text-gray-700">
                  Binance Pay
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manual"
                  name="payment"
                  checked={paymentMethod === 'manual'}
                  onChange={() => setPaymentMethod('manual')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="manual" className="ml-2 block text-sm font-medium text-gray-700">
                  Manual Crypto Payment
                </label>
              </div>
            </div>
          </Card>

          {paymentMethod === 'manual' && (
            <Card variant="outline" className="mt-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cryptocurrency
                    </label>
                    <Select
                      value={cryptoCurrency}
                      onChange={(e) => setCryptoCurrency(e.target.value)}
                      options={[
                        { value: 'USDT', label: 'USDT' },
                        { value: 'BTC', label: 'Bitcoin (BTC)' },
                        { value: 'ETH', label: 'Ethereum (ETH)' },
                        { value: 'BNB', label: 'Binance Coin (BNB)' },
                        { value: 'USDC', label: 'USD Coin (USDC)' },
                        { value: 'DOGE', label: 'Dogecoin (DOGE)' },
                      ]}
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Input
                    label={`Your ${cryptoCurrency} Address`}
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value)}
                    required
                    placeholder={`Enter your ${cryptoCurrency} address`}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Proof (Screenshot)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                          <span>Upload a file</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept="image/*"
                            onChange={(e) => setTransactionProof(e.target.files?.[0] || null)}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          )}
        </div>
        
        <div>
          <Card variant="outline">
            <h2 className="text-lg font-medium mb-4">Complete Payment</h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === 'binance'
                ? 'You will be redirected to Binance Pay to complete your payment.'
                : 'Please fill in all required fields for manual crypto payment.'}
            </p>
            
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => handleSubmit()}
              loading={isSubmitting}
              disabled={paymentMethod === '' || (paymentMethod === 'manual' && !transactionProof)}
            >
              Pay Now (${total.toFixed(2)})
            </Button>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              By completing your purchase, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
