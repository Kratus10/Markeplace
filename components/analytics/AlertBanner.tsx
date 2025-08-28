// FILE: components/analytics/AlertBanner.tsx
import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface AlertBannerProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  onAcknowledge?: () => void;
  acknowledged?: boolean;
  className?: string;
}

export default function AlertBanner({
  title,
  description,
  severity,
  onAcknowledge,
  acknowledged = false,
  className = ""
}: AlertBannerProps) {
  const getSeverityColor = (severity: AlertBannerProps['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-slate-100 border-slate-500 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: AlertBannerProps['severity']) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '🔔';
    }
  };

  if (acknowledged) {
    return null;
  }

  return (
    <Card className={`p-4 rounded-2xl shadow-soft-lg bg-white ${getSeverityColor(severity)} ${className}`}>
      <div className="flex justify-between">
        <div className="flex items-start">
          <span className="text-xl mr-3">{getSeverityIcon(severity)}</span>
          <div>
            <h3 className="font-medium text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          </div>
        </div>
        {onAcknowledge && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAcknowledge}
          >
            Acknowledge
          </Button>
        )}
      </div>
    </Card>
  );
}