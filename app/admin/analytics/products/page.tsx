// FILE: app/admin/analytics/products/page.tsx
"use client";

import React from "react";
import Card from "@/components/ui/Card";

export default function ProductAnalytics() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Product Analytics</h1>
      </div>
      
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Coming Soon</h2>
        <p className="text-slate-600">
          This section will display detailed product performance metrics including:
        </p>
        <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-600">
          <li>Product usage statistics and adoption rates</li>
          <li>Revenue breakdown by product</li>
          <li>User engagement with different product features</li>
          <li>Product performance comparisons</li>
          <li>Feature request prioritization based on usage data</li>
        </ul>
      </Card>
    </div>
  );
}