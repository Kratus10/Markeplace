// FILE: components/analytics/MetricsSummary.tsx
import React from "react";
import Card from "@/components/ui/Card";
import KpiWithSparkline from "@/components/analytics/KpiWithSparkline";

interface Metric {
  title: string;
  value: string | number;
  delta: number;
  sparklineData: number[];
  description?: string;
}

interface MetricsSummaryProps {
  metrics: Metric[];
  title: string;
  ariaLabel: string;
}

export default function MetricsSummary({ metrics, title, ariaLabel }: MetricsSummaryProps) {
  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <KpiWithSparkline
            key={index}
            title={metric.title}
            value={metric.value}
            delta={metric.delta}
            sparklineData={metric.sparklineData}
            description={metric.description}
          />
        ))}
      </div>
    </Card>
  );
}