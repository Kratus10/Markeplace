// FILE: app/admin/analytics/traffic/page.tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";

export default function TrafficAnalytics() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Traffic Analytics</h1>
      </div>
      
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Coming Soon</h2>
        <p className="text-slate-600">
          This section will display detailed traffic analytics including:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
          <li>Traffic sources and referral analysis</li>
          <li>Geographic distribution of visitors</li>
          <li>Device and browser usage statistics</li>
          <li>Page view trends and popular content</li>
          <li>Traffic spikes and anomaly detection</li>
        </ul>
      </Card>
    </div>
  );
}