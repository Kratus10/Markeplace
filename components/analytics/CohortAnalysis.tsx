// FILE: components/analytics/CohortAnalysis.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CohortData {
  cohort: string;
  periods: number[];
}

interface CohortAnalysisProps {
  data: CohortData[];
  labels: string[];
  title: string;
  ariaLabel: string;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function CohortAnalysis({ data, labels, title, ariaLabel }: CohortAnalysisProps) {
  // Transform data for Recharts
  const transformedData = data.map(cohort => {
    const obj: any = { cohort: cohort.cohort };
    cohort.periods.forEach((value, index) => {
      obj[`period${index}`] = value;
    });
    return obj;
  });
  
  if (!data || data.length === 0) {
    return (
      <div className="card p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="card p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={transformedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cohort" accessibilityLayer />
            <YAxis accessibilityLayer />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {labels[parseInt(entry.dataKey?.toString().replace('period', '') || '0')]}: {entry.value}%
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {labels.map((label, index) => (
              <Bar 
                key={label} 
                dataKey={`period${index}`} 
                name={label}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}