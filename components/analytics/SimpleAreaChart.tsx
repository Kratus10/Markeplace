// FILE: components/analytics/SimpleAreaChart.tsx
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleAreaChartProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  dataKeys: string[];
  colors?: string[];
  className?: string;
}

export default function SimpleAreaChart({
  data,
  title,
  ariaLabel,
  dataKeys,
  colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"],
  className = ""
}: SimpleAreaChartProps) {
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
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                name={key}
                accessibilityLayer
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}