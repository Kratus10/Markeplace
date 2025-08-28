// FILE: components/subscription/SubscriptionPlans.tsx
'use client'

import React from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const SubscriptionPlans: React.FC = () => {
  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 5,
      period: 'month',
      description: 'Perfect for getting started with premium features',
      features: [
        'Daily trading signals',
        'Market analysis reports',
        'Private messaging',
        'Community access'
      ]
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 48,
      period: 'year',
      description: 'Best value with all premium features',
      features: [
        'All Monthly features',
        'Priority support',
        'Exclusive webinars',
        'Advanced analytics',
        'Early access to new features'
      ],
      isPopular: true
    }
  ];

  const handleSubscribe = (planId: string) => {
    // Redirect to payment page with selected plan
    window.location.href = `/payment?plan=${planId}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`p-8 border-2 rounded-2xl transition-all ${
            plan.isPopular 
              ? 'border-purple-500 ring-2 ring-purple-200 relative' 
              : 'border-gray-200'
          }`}
        >
          {plan.isPopular && (
            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-bl-lg rounded-tr-lg">
              BEST VALUE
            </div>
          )}
          
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${
              plan.isPopular ? 'text-purple-600' : 'text-gray-900'
            } mb-2`}>
              {plan.name}
            </h3>
            
            <div className="mb-6">
              <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
              <span className="text-gray-600">
                /{plan.period}
              </span>
            </div>
            
            <p className="text-gray-600 mb-8">
              {plan.description}
            </p>
            
            <ul className="space-y-4 mb-8 text-left">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button
              variant={plan.isPopular ? 'primary' : 'outline'}
              size="lg"
              onClick={() => handleSubscribe(plan.id)}
              className={`w-full ${
                plan.isPopular 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : ''
              }`}
            >
              {plan.isPopular ? 'Get Started' : 'Choose Plan'}
            </Button>
            
            {plan.id === 'yearly' && (
              <div className="mt-4 text-center">
                <p className="text-green-600 font-medium">
                  Save $12 compared to monthly
                </p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionPlans;