// FILE: components/analytics/SimpleLineChart.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleLineChartProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  dataKeys: string[];
  colors?: string[];
  className?: string;
}

export default function SimpleLineChart({
  data,
  title,
  ariaLabel,
  dataKeys,
  colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"],
  className = ""
}: SimpleLineChartProps) {
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
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeys[0]} accessibilityLayer />
            <YAxis accessibilityLayer />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {entry.dataKey}: {entry.value?.toLocaleString()}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {dataKeys.slice(1).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name={key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}