import { getAuthSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import LicenseStatusBadge from "@/components/licenses/LicenseStatusBadge";
import RevokeLicenseButton from "@/components/clients/RevokeLicenseButton";

interface LicenseWithUser {
  id: string;
  keyHash: string;
  status: string;
  revokedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  downloads: {
    id: string;
    createdAt: Date;
  }[];
}

export default async function ProductClientsPage({
  params
}: {
  params: { id: string }
}) {
  const session = await getAuthSession();
  if (!session?.user) return redirect("/auth/login");

  // Fetch product and verify ownership
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, ownerId: true }
  });
  
  if (!product) return notFound();
  
  // Ensure current user is the product owner or admin
  if (session.user.id !== product.ownerId && session.user.role !== "ADMIN") {
    return redirect("/auth/login");
  }

  // Fetch licenses for this product
  const licenses: LicenseWithUser[] = await prisma.license.findMany({
    where: { productId: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      downloads: {
        select: {
          id: true,
          createdAt: true
        },
        orderBy: { createdAt: "desc" },
        take: 3
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Clients for {product.name}
        </h1>
      </div>

      {licenses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">
            No clients have purchased this product yet
          </p>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Download
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {licenses.map(license => (
                <tr key={license.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {license.user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {license.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <LicenseStatusBadge 
                      revoked={!!license.revokedAt} 
                      expiresAt={null} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.downloads.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.downloads[0] ? 
                      new Date(license.downloads[0].createdAt).toLocaleDateString() : 
                      'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!license.revokedAt && (
                      <RevokeLicenseButton licenseId={license.id} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
