// FILE: components/analytics/FunnelChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface FunnelStep {
  name: string;
  count: number;
  rate: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  title: string;
  ariaLabel: string;
}

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function FunnelChart({ data, title, ariaLabel }: FunnelChartProps) {
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
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" accessibilityLayer />
            <YAxis accessibilityLayer />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                      <p className="font-medium text-slate-800">{label}</p>
                      <p className="text-sm text-slate-600">Count: {payload[0].value?.toLocaleString()}</p>
                      <p className="text-sm text-slate-600">Rate: {payload[0].payload.rate}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Users" 
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}