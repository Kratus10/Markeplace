// FILE: components/analytics/InsightsPanel.tsx
import React from "react";
import Card from "@/components/ui/Card";

interface Insight {
  title: string;
  description: string;
  recommendation?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface InsightsPanelProps {
  insights: Insight[];
  title: string;
  ariaLabel: string;
}

export default function InsightsPanel({ insights, title, ariaLabel }: InsightsPanelProps) {
  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getPriorityIcon = (priority: Insight['priority']) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '💡';
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(insight.priority)}`}
          >
            <div className="flex items-start">
              <span className="text-xl mr-3">{getPriorityIcon(insight.priority)}</span>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 mb-2">{insight.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                {insight.recommendation && (
                  <p className="text-sm text-slate-700 mt-2">
                    <span className="font-medium">Recommendation:</span> {insight.recommendation}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {insights.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p>No insights available</p>
          <p className="text-sm mt-1">All metrics are within normal ranges</p>
        </div>
      )}
    </Card>
  );
}