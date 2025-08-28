// FILE: components/analytics/SimpleBarChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleBarChartProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  dataKey: string;
  nameKey: string;
  color?: string;
  className?: string;
}

export default function SimpleBarChart({
  data,
  title,
  ariaLabel,
  dataKey,
  nameKey,
  color = "#3b82f6",
  className = ""
}: SimpleBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={`p-6 rounded-2xl shadow-soft-lg bg-white ${className}`} role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 rounded-2xl shadow-soft-lg bg-white ${className}`} role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} accessibilityLayer />
            <YAxis accessibilityLayer />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      <p className="text-sm text-slate-600">
                        {payload[0].name}: {payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey={dataKey} 
              name={dataKey} 
              fill={color}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}