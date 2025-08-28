import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import LicenseCard from '@/components/licenses/LicenseCard';

export default async function LicensesPage() {
  const session = await getSession();
  if (!session || !session.user) {
    return <div className="container mx-auto py-12">Please log in to view your licenses</div>;
  }

  const licenses = await prisma.license.findMany({
    where: { userId: session.user.id },
    include: { product: true }
  });

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Your Licenses</h1>
      
      {licenses.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">You haven't purchased any products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {licenses.map(license => (
            <LicenseCard key={license.id} license={license} />
          ))}
        </div>
      )}
    </div>
  );
}
