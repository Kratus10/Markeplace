// FILE: components/analytics/KpiWithSparkline.tsx
import React from "react";
import Card from "@/components/ui/Card";
import Sparkline from "@/components/analytics/Sparkline";
import { formatNumber, formatCurrency, formatPercentage } from "@/lib/utils/analyticsFormatter";

interface KpiWithSparklineProps {
  title: string;
  value: number | string;
  delta: number;
  sparklineData: number[];
  description?: string;
  className?: string;
}

export default function KpiWithSparkline({
  title,
  value,
  delta,
  sparklineData,
  description,
  className = ""
}: KpiWithSparklineProps) {
  const isPositive = delta >= 0;
  
  // Format the value based on its type
  const formattedValue = typeof value === 'number' 
    ? value > 1000000 
      ? formatCurrency(value) 
      : formatNumber(value)
    : value;
  
  return (
    <Card className={`p-4 rounded-2xl shadow-soft-lg bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-extrabold">{formattedValue}</span>
            <small className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? `+${formatPercentage(delta)}` : `${formatPercentage(delta)}`}
            </small>
          </div>
        </div>
        <div className="w-24 h-8">
          <Sparkline 
            data={sparklineData} 
            color={isPositive ? '#10b981' : '#ef4444'} 
          />
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