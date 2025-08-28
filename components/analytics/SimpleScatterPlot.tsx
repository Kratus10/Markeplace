// FILE: components/analytics/SimpleScatterPlot.tsx
import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleScatterPlotProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  xAxisKey: string;
  yAxisKey: string;
  zAxisKey?: string;
  color?: string;
  className?: string;
}

export default function SimpleScatterPlot({
  data,
  title,
  ariaLabel,
  xAxisKey,
  yAxisKey,
  zAxisKey,
  color = "#3b82f6",
  className = ""
}: SimpleScatterPlotProps) {
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
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey={xAxisKey} 
              name={xAxisKey}
              accessibilityLayer 
            />
            <YAxis 
              type="number" 
              dataKey={yAxisKey} 
              name={yAxisKey}
              accessibilityLayer 
            />
            {zAxisKey && <ZAxis type="number" dataKey={zAxisKey} name={zAxisKey} />}
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {entry.name}: {entry.value?.toLocaleString()}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter 
              name={title} 
              data={data} 
              fill={color}
              accessibilityLayer
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}