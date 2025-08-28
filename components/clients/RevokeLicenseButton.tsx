'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

interface RevokeLicenseButtonProps {
  licenseId: string;
}

const RevokeLicenseButton: React.FC<RevokeLicenseButtonProps> = ({ 
  licenseId 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRevoke = async () => {
    if (!confirm('Are you sure you want to revoke this license? This action cannot be undone.')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/licenses/${licenseId}/revoke`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to revoke license');
      router.refresh();
    } catch (error) {
      console.error('License revocation error:', error);
      alert('Failed to revoke license');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleRevoke} 
      disabled={isLoading}
      variant="danger"
      size="sm"
    >
      {isLoading ? 'Revoking...' : 'Revoke'}
    </Button>
  );
};

export default RevokeLicenseButton;
