// FILE: components/analytics/SimpleKpiCard.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface SimpleKpiCardProps {
  title: string;
  value: string | number;
  change: number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function SimpleKpiCard({
  title,
  value,
  change,
  description,
  icon,
  className = ""
}: SimpleKpiCardProps) {
  return (
    <Card className={`p-4 rounded-2xl shadow-soft-lg bg-white ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-extrabold">{value}</span>
            <small className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? `+${change}%` : `${change}%`}
            </small>
          </div>
        </div>
        {icon && (
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            {icon}
          </div>
        )}
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