// FILE: components/analytics/MetricCard.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface MetricCardProps {
  title: string;
  value: string | number;
  delta: number;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  className?: string;
}

export default function MetricCard({ title, value, delta, trend, description, className = "" }: MetricCardProps) {
  // Use trend prop if provided, otherwise infer from delta
  const effectiveTrend = trend || (delta >= 0 ? 'up' : 'down');
  
  return (
    <Card className={`p-4 rounded-2xl shadow-soft-lg bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-extrabold">{value}</span>
            <small className={`text-sm ${effectiveTrend === 'up' ? 'text-green-600' : effectiveTrend === 'down' ? 'text-red-600' : 'text-slate-500'}`}>
              {effectiveTrend === 'up' ? `+${delta}%` : `${delta}%`}
            </small>
          </div>
        </div>
      </div>
      {description && (
        <p className="mt-2 text-xs text-slate-500">{description}</p>
      )}
      <p className="mt-2 text-xs text-slate-500">
        As of <time>{new Date().toLocaleDateString()}</time>
      </p>
    </Card>
  );
}