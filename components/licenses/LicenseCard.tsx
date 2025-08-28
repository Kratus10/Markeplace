import Link from 'next/link';
import { License, Product } from '@prisma/client';
import { format } from 'date-fns';

type LicenseCardProps = {
  license: License & { product: Product };
};

export default function LicenseCard({ license }: LicenseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {license.product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Issued on: {format(new Date(license.issuedAt), 'MMM dd, yyyy')}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            license.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800' 
              : license.status === 'REVOKED' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
          }`}>
            {license.status}
          </span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            License ID: <span className="font-mono">{license.id}</span>
          </p>
        </div>
        
        <div className="mt-6">
          <Link 
            href={`/account/licenses/${license.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View License Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
