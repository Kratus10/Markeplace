import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';

export const runtime = "nodejs";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    // Redirect to login if not authenticated
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You need to be logged in to view this page.</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
          <p>Welcome, {session.user.name || session.user.email}!</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/account/settings" className="text-blue-600 hover:underline">
                Account Settings
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="text-blue-600 hover:underline">
                Order History
              </Link>
            </li>
            <li>
              <Link href="/account/licenses" className="text-blue-600 hover:underline">
                My Licenses
              </Link>
            </li>
            <li>
              <Link href="/account/downloads" className="text-blue-600 hover:underline">
                Downloads
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}