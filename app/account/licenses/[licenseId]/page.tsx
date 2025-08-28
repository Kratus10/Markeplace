import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { format } from 'date-fns';
import DownloadButton from '@/components/licenses/DownloadButton';

type LicenseDetails = Prisma.LicenseGetPayload<{
  include: { product: true };
}>;

export default async function LicenseDetailPage({
  params,
}: {
  params: { licenseId: string };
}) {
  const session = await getSession();
  if (!session || !session.user) {
    return <div>Please log in to view this license</div>;
  }

const license = await prisma.license.findUnique({
  where: { id: params.licenseId },
  include: { product: true }
  });

  if (!license || license.userId !== session.user.id) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {license.product.name} License
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Issued on: {format(new Date(license.issuedAt), 'MMM dd, yyyy')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              license.revokedAt
                ? 'bg-red-100 text-red-800' 
                : (license.expiresAt && new Date(license.expiresAt) < new Date())
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
            }`}>
              {license.revokedAt ? 'REVOKED' : 
               (license.expiresAt && new Date(license.expiresAt) < new Date()) ? 'EXPIRED' : 'ACTIVE'}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">License Information</h2>
              <div className="mt-2 bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">License ID</p>
                    <p className="font-mono text-sm">{license.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="text-sm">{license.product.name}</p>
                  </div>
                  <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm">
                    {license.revokedAt ? 'REVOKED' : 
                     (license.expiresAt && new Date(license.expiresAt) < new Date()) ? 'EXPIRED' : 'ACTIVE'}
                  </p>
                  </div>
                  {license.expiresAt && (
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="text-sm">{format(new Date(license.expiresAt), 'MMM dd, yyyy')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900">Download</h2>
              <div className="mt-4">
                <DownloadButton licenseId={license.id} />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                You can download this product up to 5 times. Downloads expire after 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
