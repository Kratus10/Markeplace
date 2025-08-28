// FILE: components/analytics/TimeseriesChart.tsx
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface TimeseriesDataPoint {
  date: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeseriesChartProps {
  data: TimeseriesDataPoint[];
  title: string;
  dataKeys: string[];
  colors?: string[];
  ariaLabel: string;
}

export default function TimeseriesChart({ 
  data, 
  title, 
  dataKeys, 
  colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"], 
  ariaLabel 
}: TimeseriesChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Generate unique IDs for accessibility
  const chartId = `timeseries-chart-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!data || data.length === 0) return;
    
    if (e.key === "ArrowRight") {
      setActiveIndex(prev => prev === null ? 0 : Math.min(prev + 1, data.length - 1));
    } else if (e.key === "ArrowLeft") {
      setActiveIndex(prev => prev === null ? data.length - 1 : Math.max(prev - 1, 0));
    }
  };

  // Announce current point to screen readers
  const announcePoint = (index: number) => {
    const point = data[index];
    if (point) {
      const values = dataKeys.map(key => `${key}: ${point[key]}`).join(", ");
      // In a real implementation, you would update an aria-live region
      console.log(`Date: ${point.date}, ${values}`);
    }
  };

  React.useEffect(() => {
    if (activeIndex !== null) {
      announcePoint(activeIndex);
    }
  }, [activeIndex]);

  if (!data || data.length === 0) {
    return (
      <div className="card p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <div 
      className="card p-6 rounded-2xl shadow-soft-lg bg-white" 
      role="region" 
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              accessibilityLayer
            />
            <YAxis 
              accessibilityLayer
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                          {entry.dataKey}: {entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ 
                  onClick: (_, entry) => {
                    if (entry && typeof entry.index === 'number') {
                      setActiveIndex(entry.index);
                    }
                  }
                }}
                strokeWidth={2}
                dot={{ r: 4 }}
                tabIndex={-1}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-slate-500">
        <p>Use arrow keys to navigate data points</p>
      </div>
    </div>
  );
}