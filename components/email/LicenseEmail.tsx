import * as React from 'react';

interface LicenseEmailProps {
  licenseKey: string;
  productName: string;
  userName: string;
  downloadUrl: string;
}

export const LicenseEmail: React.FC<LicenseEmailProps> = ({
  licenseKey,
  productName,
  userName,
  downloadUrl,
}) => (
  <div className="font-sans max-w-2xl mx-auto">
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Your License for {productName}
      </h1>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-2">Hi {userName},</p>
        <p className="text-gray-700 mb-4">
          Thank you for your purchase! Here is your license for {productName}. Please keep this email
          for your records as you'll need this license to access and activate the product.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-900 mb-2">License Key</h2>
          <div className="font-mono bg-gray-100 p-3 rounded text-sm break-all">
            {licenseKey}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This key will be required during product activation.
          </p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Download Your Product
        </h2>
        <a 
          href={downloadUrl}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Download Now
        </a>
        <p className="text-sm text-gray-600 mt-2">
          The download link will expire in 30 days. You can also download from your account.
        </p>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h2>
        <p className="text-gray-700 mb-2">
          If you have any questions or issues, please contact our support team at support@example.com.
        </p>
        <p className="text-gray-700">
          For your security, do not share this license key with anyone.
        </p>
      </div>
    </div>
  </div>
);
