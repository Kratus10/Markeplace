import { auth } from '@/lib/auth/authOptions';
import { redirect } from 'next/navigation';
import { getCurrentSignal } from '@/lib/signals/signals';
import SignalContent from '@/components/signals/SignalContent';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SignalsPage() {
  const session = await auth();
  // Redirect non-authenticated users to login
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check if user is admin
  const isAdmin = session.user.role === 'ADMIN_L1' || 
                  session.user.role === 'ADMIN_L2' || 
                  session.user.role === 'OWNER';
  
  // Check if user has an active subscription
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'ACTIVE',
      endDate: {
        gte: new Date()
      }
    }
  });
  
  const isPremium = !!subscription;

  // Handle non-premium users
  if (!isAdmin && !isPremium) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Premium Signals</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <p className="text-yellow-700">
            Only premium subscribers can view trading signals and send direct messages.
          </p>
          <p className="text-yellow-700 mt-2">
            Subscribe now to unlock these premium features and connect with our trading experts.
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link 
            href="/subscribe" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 mr-4"
          >
            Monthly Subscription ($5)
          </Link>
          <Link 
            href="/subscribe" 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
          >
            Yearly Subscription ($48 - Save $12)
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has pending approval
  const pendingApproval = await prisma.subscription.findFirst({
    where: {
      userId: session.user.id,
      status: 'PENDING_APPROVAL'
    }
  });

  if (pendingApproval) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Subscription Pending Approval</h1>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <p className="text-blue-700">
            Your subscription is awaiting admin approval. You'll receive a notification once it's activated.
          </p>
          <p className="text-blue-700 mt-2">
            This usually takes less than 24 hours. Thank you for your patience.
          </p>
        </div>
      </div>
    );
  }

  const currentSignal = await getCurrentSignal();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Latest Trading Signals</h1>
      <p className="text-gray-600 mb-6">
        These signals are provided by our expert traders. Remember to do your own research before making any trades.
      </p>
      <SignalContent signal={currentSignal} />
      
      {isPremium && (
        <div className="mt-12 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold mb-2">Direct Messaging</h2>
          <p className="mb-4">
            As a premium subscriber, you can send direct messages to our trading experts for personalized advice.
          </p>
          <Link 
            href="/messages" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Message an Expert
          </Link>
        </div>
      )}
    </div>
  );
}
