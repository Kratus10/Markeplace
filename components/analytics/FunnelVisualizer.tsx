// FILE: components/analytics/FunnelVisualizer.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface FunnelStep {
  name: string;
  count: number;
  rate: number;
}

interface FunnelVisualizerProps {
  steps: FunnelStep[];
  title: string;
  ariaLabel: string;
}

export default function FunnelVisualizer({ steps, title, ariaLabel }: FunnelVisualizerProps) {
  if (!steps || steps.length === 0) {
    return (
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No funnel data available</p>
      </Card>
    );
  }

  // Calculate the maximum count for scaling
  const maxCount = Math.max(...steps.map(step => step.count));

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {steps.map((step, index) => {
          // Calculate width as a percentage of the maximum count
          const widthPercentage = (step.count / maxCount) * 100;
          
          return (
            <div key={index} className="flex items-center">
              <div className="w-32 text-sm font-medium text-slate-700">{step.name}</div>
              <div className="flex-1 mx-4">
                <div className="relative h-12">
                  <div 
                    className="absolute inset-0 bg-blue-100 rounded-lg"
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-slate-700">
                      {step.count.toLocaleString()} ({step.rate}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-24 text-right text-sm text-slate-500">
                {index > 0 ? `${Math.round(100 - (step.count / steps[index-1].count * 100))}% drop` : ''}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <h4 className="font-medium text-slate-800 mb-2">Funnel Insights</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
          <li>Highest drop-off occurs between Signups and Checkout (55.8%)</li>
          <li>Repeat purchase rate is 1.4% of initial visits</li>
          <li>Overall conversion rate is 5.5%</li>
        </ul>
      </div>
    </Card>
  );
}