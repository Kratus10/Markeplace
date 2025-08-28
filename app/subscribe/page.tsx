// FILE: app/subscribe/page.tsx
import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { prisma } from '@/lib/prisma';

export default async function SubscribePage() {
  const session = await auth();
  
  // Redirect non-authenticated users to login
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Get user's current subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
      endDate: {
        gte: new Date()
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Subscription</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unlock exclusive trading signals, market analysis, and premium features with our subscription plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SubscriptionPlans />
        </div>
        
        <div>
          <SubscriptionStatus subscription={subscription ? {
            id: subscription.id,
            planType: subscription.planType,
            status: subscription.status,
            startDate: subscription.startDate.toISOString(),
            endDate: subscription.endDate.toISOString(),
            autoRenew: subscription.autoRenew,
            createdAt: subscription.createdAt.toISOString()
          } : null} />
        </div>
      </div>
    </div>
  );
}