// FILE: components/analytics/AnalyticsAlerts.tsx
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

interface AnalyticsAlertsProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  title: string;
  ariaLabel: string;
}

export default function AnalyticsAlerts({ alerts, onAcknowledge, title, ariaLabel }: AnalyticsAlertsProps) {
  const [filter, setFilter] = useState<'all' | 'unacknowledged'>('unacknowledged');

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => !alert.acknowledged);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-slate-100 border-slate-500 text-slate-800';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Alerts
          </Button>
          <Button 
            variant={filter === 'unacknowledged' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setFilter('unacknowledged')}
          >
            Unacknowledged
          </Button>
          <Button variant="outline" size="sm">
            Configure Alerts
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`border-l-4 p-4 rounded-r-lg ${getSeverityColor(alert.severity)} ${
              alert.acknowledged ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between">
              <div className="flex items-start">
                <span className="text-xl mr-3">{getSeverityIcon(alert.severity)}</span>
                <div>
                  <h3 className="font-medium text-slate-800">{alert.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onAcknowledge(alert.id)}
                >
                  Acknowledge
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredAlerts.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No {filter === 'unacknowledged' ? 'unacknowledged ' : ''}alerts</p>
          <p className="text-sm mt-1">All systems are operating normally</p>
        </div>
      )}
    </Card>
  );
}