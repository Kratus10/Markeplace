import React from 'react';

interface LicenseStatusBadgeProps {
  revoked: boolean;
  expiresAt?: Date | null;
}

const LicenseStatusBadge: React.FC<LicenseStatusBadgeProps> = ({ 
  revoked, 
  expiresAt 
}) => {
  let text = 'Active';
  let bgColor = 'bg-green-100';
  let textColor = 'text-green-800';
  
  if (revoked) {
    text = 'Revoked';
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  } else if (expiresAt && new Date(expiresAt) < new Date()) {
    text = 'Expired';
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

export default LicenseStatusBadge;
