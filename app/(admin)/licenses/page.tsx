import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import LicenseAdminCard from '@/components/admin/LicenseAdminCard';

export default async function AdminLicensePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1' && session.user.role !== 'ADMIN_L2')) {
    return notFound();
  }

  const licenses = await prisma.license.findMany({
    include: {
      user: true,
      product: true,
    },
    orderBy: {
      issuedAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">License Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {licenses.map(license => (
          <LicenseAdminCard 
            key={license.id} 
            license={license} 
            productName={license.product?.name || 'Product Deleted'} 
            userName={license.user?.name || license.user?.email || 'User Deleted'}
          />
        ))}
      </div>
    </div>
  );
}
