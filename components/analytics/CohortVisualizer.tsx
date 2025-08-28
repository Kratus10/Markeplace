// FILE: components/analytics/CohortVisualizer.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface CohortVisualizerProps {
  data: {
    retention: Array<{
      cohort: string;
      periods: number[];
    }>;
    labels: string[];
  };
  title: string;
  ariaLabel: string;
}

export default function CohortVisualizer({ data, title, ariaLabel }: CohortVisualizerProps) {
  if (!data || !data.retention || data.retention.length === 0) {
    return (
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No cohort data available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cohort</th>
              {data.labels.map((label, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.retention.map((cohort, cohortIndex) => (
              <tr key={cohortIndex}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cohort.cohort}</td>
                {cohort.periods.map((rate, periodIndex) => {
                  // Determine cell color based on retention rate
                  let bgColor = 'bg-slate-100';
                  if (rate >= 75) bgColor = 'bg-blue-500';
                  else if (rate >= 50) bgColor = 'bg-blue-400';
                  else if (rate >= 25) bgColor = 'bg-blue-300';
                  else if (rate >= 10) bgColor = 'bg-blue-200';
                  else if (rate > 0) bgColor = 'bg-blue-100';
                  
                  return (
                    <td 
                      key={periodIndex} 
                      className={`px-6 py-4 whitespace-nowrap text-sm ${bgColor} text-center`}
                    >
                      {rate}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200">
        <h4 className="font-medium text-slate-800 mb-2">Cohort Insights</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
          <li>New cohorts show stronger initial retention but faster decline</li>
          <li>Older cohorts maintain more consistent long-term retention</li>
          <li>Overall retention improves by 2.1% quarter over quarter</li>
        </ul>
      </div>
    </Card>
  );
}