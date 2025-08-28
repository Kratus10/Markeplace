// FILE: components/analytics/KeyMetrics.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface KeyMetric {
  title: string;
  value: string | number;
  delta: number;
  description?: string;
  trend: 'up' | 'down' | 'neutral';
}

interface KeyMetricsProps {
  metrics: KeyMetric[];
  title: string;
  ariaLabel: string;
}

export default function KeyMetrics({ metrics, title, ariaLabel }: KeyMetricsProps) {
  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4 rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-slate-600">{metric.title}</h4>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-extrabold">{metric.value}</span>
                  <small className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 
                    'text-slate-500'
                  }`}>
                    {metric.delta >= 0 ? `+${metric.delta}%` : `${metric.delta}%`}
                  </small>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                metric.trend === 'up' ? 'bg-green-100 text-green-600' : 
                metric.trend === 'down' ? 'bg-red-100 text-red-600' : 
                'bg-slate-100 text-slate-600'
              }`}>
                {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '●'}
              </div>
            </div>
            {metric.description && (
              <p className="mt-2 text-xs text-slate-500">{metric.description}</p>
            )}
            <p className="mt-2 text-xs text-slate-500">
              As of <time>{new Date().toLocaleDateString()}</time>
            </p>
          </Card>
        ))}
      </div>
    </Card>
  );
}