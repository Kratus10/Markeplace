'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
}

const PaymentPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('binance');
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT');
  const [txHash, setTxHash] = useState('');
  const [orderId, setOrderId] = useState('');

  const plans: SubscriptionPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 5,
      period: 'month',
      description: 'Perfect for getting started with premium features'
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 48,
      period: 'year',
      description: 'Best value with all premium features'
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan) || plans[0];

  const handleBinancePay = async () => {
    setLoading(true);
    try {
      // Create subscription order
      const response = await fetch('/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan === 'monthly' ? 'MONTHLY' : 'YEARLY',
          paymentMethod: 'binance'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Binance Pay
        if (result.data.paymentUrl) {
          window.location.href = result.data.paymentUrl;
        } else {
          toast.error('Failed to initiate Binance Pay');
        }
      } else {
        toast.error(result.error || 'Failed to create subscription order');
      }
    } catch (error) {
      console.error('Binance Pay error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    try {
      // Create subscription order
      const response = await fetch('/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: selectedPlan === 'monthly' ? 'MONTHLY' : 'YEARLY',
          paymentMethod: 'manual',
          cryptoCurrency
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.orderId);
        toast.success('Order created successfully. Please send payment to the provided address.');
      } else {
        toast.error(result.error || 'Failed to create subscription order');
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!txHash || !orderId) {
      toast.error('Please provide transaction hash and order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/manual/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          txHash
        }),
      });

      const result = await response.json();

      if (result.ok) {
        toast.success('Payment verified successfully! Your subscription will be active shortly.');
        router.push('/profile');
      } else {
        toast.error(result.error || 'Failed to verify payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Premium</h1>
        <p className="text-xl text-gray-600">
          Unlock exclusive trading signals and premium features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Plan Selection */}
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Select Plan</h2>
          
          <div className="space-y-4">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${plan.price}</div>
                    <div className="text-gray-500 text-sm">per {plan.period}</div>
                  </div>
                </div>
                
                {plan.id === 'yearly' && (
                  <div className="mt-3 p-2 bg-green-100 rounded-lg">
                    <p className="text-green-800 text-sm font-medium">Save $12 compared to monthly</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
          
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <div className="space-y-3">
              <div 
                className={`p-4 border-2 rounded-xl cursor-pointer ${
                  paymentMethod === 'binance' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('binance')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    paymentMethod === 'binance' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'binance' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Binance Pay</h3>
                    <p className="text-gray-600 text-sm">Fast and secure payment</p>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-xl cursor-pointer ${
                  paymentMethod === 'manual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('manual')}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                    paymentMethod === 'manual' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'manual' && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Manual Crypto Payment</h3>
                    <p className="text-gray-600 text-sm">Pay with cryptocurrency</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manual Payment Form */}
            {paymentMethod === 'manual' && (
              <div className="space-y-4">
                <Select
                  label="Cryptocurrency"
                  value={cryptoCurrency}
                  onChange={(e) => setCryptoCurrency(e.target.value)}
                  options={[
                    { value: 'USDT', label: 'USDT (Tether)' },
                    { value: 'BTC', label: 'BTC (Bitcoin)' },
                    { value: 'ETH', label: 'ETH (Ethereum)' },
                    { value: 'BNB', label: 'BNB (Binance Coin)' }
                  ]}
                />
                
                {orderId && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Send exactly ${selectedPlanData.price} to:</p>
                    <p className="font-mono text-sm break-all">
                      {process.env.NEXT_PUBLIC_CRYPTO_ADDRESS || 'Deposit address not available'}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Order ID: {orderId}</p>
                  </div>
                )}
                
                <Input
                  label="Transaction Hash"
                  placeholder="Enter transaction hash after sending payment"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>
            )}
            
            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{selectedPlanData.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">${selectedPlanData.price}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total:</span>
                <span>${selectedPlanData.price}</span>
              </div>
            </div>
            
            {/* Action Button */}
            <Button
              variant="primary"
              className="w-full"
              onClick={paymentMethod === 'binance' ? handleBinancePay : handleManualPayment}
              loading={loading}
              disabled={paymentMethod === 'manual' && !orderId}
            >
              {paymentMethod === 'binance' 
                ? 'Pay with Binance Pay' 
                : orderId 
                  ? 'Verify Payment' 
                  : 'Create Order'}
            </Button>
            
            {paymentMethod === 'manual' && orderId && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleVerifyPayment}
                loading={loading}
              >
                Verify Payment
              </Button>
            )}
          </div>
        </Card>
      </div>
      
      {/* Payment Status */}
      <Card className="mt-8 p-6 rounded-2xl shadow-soft-lg bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Status</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> After completing your payment, please wait for confirmation. 
                For manual crypto payments, your subscription will be activated after the transaction 
                is verified (usually within 10-30 minutes).
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentPage;