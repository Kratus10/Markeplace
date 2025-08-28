// FILE: components/analytics/SimpleTreeMap.tsx
import React from "react";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import Card from "@/components/ui/Card";

interface SimpleTreeMapProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  dataKey: string;
  nameKey: string;
  colors?: string[];
  className?: string;
}

export default function SimpleTreeMap({
  data,
  title,
  ariaLabel,
  dataKey,
  nameKey,
  colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"],
  className = ""
}: SimpleTreeMapProps) {
  if (!data || data.length === 0) {
    return (
      <Card className={`p-6 rounded-2xl shadow-soft-lg bg-white ${className}`} role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </Card>
    );
  }

  // Normalize data for Treemap
  const normalizedData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length]
  }));

  return (
    <Card className={`p-6 rounded-2xl shadow-soft-lg bg-white ${className}`} role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={normalizedData}
            dataKey={dataKey}
            nameKey={nameKey}
            stroke="#fff"
            fill="#3b82f6"
            accessibilityLayer
          >
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
          </Treemap>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}