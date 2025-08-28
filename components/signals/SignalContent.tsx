import React from 'react';
import { Signal } from '@/lib/signals/signals';

interface SignalContentProps {
  signal: Signal | null;
}

const SignalContent: React.FC<SignalContentProps> = ({ signal }) => {
  if (!signal) {
    return <p>No signals available at this time.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">{signal.title}</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-600">Symbol</p>
          <p className="font-semibold">{signal.symbol}</p>
        </div>
        <div>
          <p className="text-gray-600">Action</p>
          <p className="font-semibold">{signal.action}</p>
        </div>
        <div>
          <p className="text-gray-600">Entry</p>
          <p className="font-semibold">{signal.entry}</p>
        </div>
        <div>
          <p className="text-gray-600">Take Profit</p>
          <p className="font-semibold">{signal.takeProfit}</p>
        </div>
        <div>
          <p className="text-gray-600">Stop Loss</p>
          <p className="font-semibold">{signal.stopLoss}</p>
        </div>
        <div>
          <p className="text-gray-600">Confidence</p>
          <p className="font-semibold">{signal.confidence}</p>
        </div>
      </div>
      {signal.description && (
        <div className="mb-6">
          <p className="text-gray-600">Description</p>
          <p>{signal.description}</p>
        </div>
      )}
      <div>
        <p className="text-gray-600">Signal Details</p>
        <div className="prose" dangerouslySetInnerHTML={{ __html: signal.content }} />
      </div>
      <p className="text-gray-500 mt-4">
        Last updated: {new Date(signal.updatedAt).toLocaleString()}
      </p>
    </div>
  );
};

export default SignalContent;
