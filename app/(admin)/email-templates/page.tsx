import React from 'react';

const EmailTemplatesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Email Templates</h1>
      <p className="text-gray-600">
        Email template management is under development. You'll be able to create, edit, 
        and manage email templates here soon.
      </p>
      <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Features coming soon:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Create and edit email templates</li>
          <li>Preview templates with test data</li>
          <li>View email send logs</li>
          <li>Manage template versions</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;
