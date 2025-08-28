// FILE: components/analytics/SimpleRadarChart.tsx
import React from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleRadarChartProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  dataKey: string;
  nameKey: string;
  color?: string;
  className?: string;
}

export default function SimpleRadarChart({
  data,
  title,
  ariaLabel,
  dataKey,
  nameKey,
  color = "#3b82f6",
  className = ""
}: SimpleRadarChartProps) {
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
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="80%" 
            data={data}
            accessibilityLayer
          >
            <PolarGrid />
            <PolarAngleAxis dataKey={nameKey} accessibilityLayer />
            <PolarRadiusAxis angle={30} domain={[0, 100]} accessibilityLayer />
            <Radar
              name={title}
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.6}
              accessibilityLayer
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      <p className="text-sm text-slate-600">
                        {dataKey}: {payload[0].value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}