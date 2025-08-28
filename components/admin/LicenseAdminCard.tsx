import React from 'react';
import { License } from '@prisma/client';
import Button from '@/components/ui/Button';

interface LicenseAdminCardProps {
  license: License;
  productName: string;
  userName: string;
}

const LicenseAdminCard: React.FC<LicenseAdminCardProps> = ({ 
  license, 
  productName,
  userName
}) => {
  const handleRevoke = async () => {
    if (confirm('Are you sure you want to revoke this license?')) {
      try {
        const response = await fetch(`/api/admin/licenses/${license.id}/revoke`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          alert('License revoked successfully');
        } else {
          throw new Error('Failed to revoke license');
        }
      } catch (error) {
        console.error('Error revoking license:', error);
        alert('Error revoking license');
      }
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch(`/api/admin/licenses/${license.id}/resend-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        alert('License email resent successfully');
      } else {
        throw new Error('Failed to resend license email');
      }
    } catch (error) {
      console.error('Error resending email:', error);
      alert('Error resending email');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{productName}</h3>
          <p className="text-sm text-gray-600">{userName}</p>
          <p className="text-sm mt-2">
            <span className="font-semibold">Status:</span> {license.status}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Issued:</span> {new Date(license.issuedAt).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className={`px-2 py-1 text-xs rounded-full ${
            license.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            license.status === 'REVOKED' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {license.status}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleResendEmail}>
          Resend Email
        </Button>
        <Button variant="danger" size="sm" onClick={handleRevoke}>
          Revoke
        </Button>
      </div>
    </div>
  );
};

export default LicenseAdminCard;
