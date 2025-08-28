// FILE: components/analytics/AlertsPanel.tsx
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

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Unusual Traffic Spike',
      description: 'Traffic increased by 35% compared to the same time last week',
      severity: 'medium',
      timestamp: '2024-02-28T14:30:00Z',
      acknowledged: false
    },
    {
      id: '2',
      title: 'Drop in Conversion Rate',
      description: 'Conversion rate dropped to 3.2%, down from 4.8% yesterday',
      severity: 'high',
      timestamp: '2024-02-28T12:15:00Z',
      acknowledged: false
    },
    {
      id: '3',
      title: 'Server Response Time Increase',
      description: 'Average response time increased to 850ms, up from 420ms',
      severity: 'medium',
      timestamp: '2024-02-28T10:45:00Z',
      acknowledged: true
    },
    {
      id: '4',
      title: 'Payment Processing Issues',
      description: '5% of payments failed in the last hour',
      severity: 'critical',
      timestamp: '2024-02-28T09:20:00Z',
      acknowledged: false
    }
  ]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

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
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Analytics Alerts</h2>
        <Button variant="outline" size="sm">
          Configure Alerts
        </Button>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
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
                  onClick={() => acknowledgeAlert(alert.id)}
                >
                  Acknowledge
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No active alerts</p>
          <p className="text-sm mt-1">All systems are operating normally</p>
        </div>
      )}
    </Card>
  );
}