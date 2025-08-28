import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from '@/lib/prisma';
import Link from "next/link";
import DownloadButton from "@/components/licenses/DownloadButton";

export default async function DownloadsPage() {
  const user = await getCurrentUser();
  if (!user) return <div>Not authenticated</div>;

  // Fetch user's licenses with product details
  const licenses = await prisma.license.findMany({
    where: { userId: user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          currentVersion: true,
        }
      },
      _count: {
        select: { downloads: true }
      }
    }
  });

  // Filter out invalid licenses
  const validLicenses = licenses.filter((license: any) => 
    !license.revokedAt && 
    (!license.expiresAt || license.expiresAt > new Date())
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">My Downloads</h1>
      
      {validLicenses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't purchased any downloadable products yet</p>
          <Link 
            href="/marketplace" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {validLicenses.map((license: any) => (
            <div 
              key={license.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{license.product.name}</h2>
                  <p className="text-gray-600 mb-2">v{license.product.currentVersion}</p>
                  <p className="text-gray-600 text-sm">{license.product.description}</p>
                </div>
                <DownloadButton licenseId={license.id} />
              </div>

              {license._count.downloads > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h3 className="font-medium mb-2">Recent downloads</h3>
                  <p className="text-sm text-gray-500">{license._count.downloads} total downloads</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
