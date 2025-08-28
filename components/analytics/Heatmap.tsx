// FILE: components/analytics/Heatmap.tsx
import React from "react";

interface HeatmapData {
  hour: number;
  day: string;
  value: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  title: string;
  ariaLabel: string;
}

export default function Heatmap({ data, title, ariaLabel }: HeatmapProps) {
  // Days of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Hours of the day
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Find min and max values for color scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Function to get color based on value
  const getColor = (value: number) => {
    if (value === 0) return 'bg-slate-100';
    
    const ratio = (value - minValue) / (maxValue - minValue);
    if (ratio < 0.2) return 'bg-blue-100';
    if (ratio < 0.4) return 'bg-blue-200';
    if (ratio < 0.6) return 'bg-blue-300';
    if (ratio < 0.8) return 'bg-blue-400';
    return 'bg-blue-500';
  };

  // Create a map for quick lookup
  const dataMap = new Map<string, number>();
  data.forEach(d => {
    dataMap.set(`${d.day}-${d.hour}`, d.value);
  });

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
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex mb-2">
            <div className="w-12"></div>
            {hours.map(hour => (
              <div key={hour} className="w-8 text-center text-xs text-slate-500">
                {hour}
              </div>
            ))}
          </div>
          
          {days.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs text-slate-500">{day}</div>
              {hours.map(hour => {
                const value = dataMap.get(`${day}-${hour}`) || 0;
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`w-8 h-8 flex items-center justify-center text-xs ${getColor(value)} border border-slate-200`}
                    title={`${day} ${hour}:00 - ${value} users`}
                    aria-label={`${day} ${hour}:00, ${value} users`}
                  >
                    {value > 0 ? value : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className="text-xs text-slate-500 mr-2">Less</div>
        <div className="flex">
          <div className="w-4 h-4 bg-slate-100 border border-slate-200"></div>
          <div className="w-4 h-4 bg-blue-100 border border-slate-200"></div>
          <div className="w-4 h-4 bg-blue-200 border border-slate-200"></div>
          <div className="w-4 h-4 bg-blue-300 border border-slate-200"></div>
          <div className="w-4 h-4 bg-blue-400 border border-slate-200"></div>
          <div className="w-4 h-4 bg-blue-500 border border-slate-200"></div>
        </div>
        <div className="text-xs text-slate-500 ml-2">More</div>
      </div>
    </div>
  );
}