// FILE: components/analytics/Sparkline.tsx
import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function Sparkline({
  data,
  width = 100,
  height = 40,
  color = "#3b82f6",
  className = ""
}: SparklineProps) {
  // Convert simple array of numbers to the format required by Recharts
  const chartData = data.map((value, index) => ({
    x: index,
    y: value
  }));

  if (data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-xs text-slate-400">No data</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <Line
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}