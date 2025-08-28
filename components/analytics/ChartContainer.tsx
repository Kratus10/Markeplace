// FILE: components/analytics/ChartContainer.tsx
import React, { useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell 
} from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

type ChartType = 'line' | 'bar' | 'area' | 'pie';

interface ChartContainerProps {
  data: Record<string, any>[];
  title: string;
  ariaLabel: string;
  chartTypes?: ChartType[];
  defaultChartType?: ChartType;
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: string[];
}

export default function ChartContainer({
  data,
  title,
  ariaLabel,
  chartTypes = ['line', 'bar', 'area'],
  defaultChartType = 'line',
  xAxisKey,
  yAxisKeys,
  colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"]
}: ChartContainerProps) {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
        <h3 className="text-lg font-medium text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name={key}
              />
            ))}
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                name={key}
              />
            ))}
          </AreaChart>
        );
      
      case 'pie':
        // For pie charts, we need to transform the data
        const pieData = data.map(item => ({
          name: item[xAxisKey],
          ...yAxisKeys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
        }));
        
        return (
          <PieChart>
            {yAxisKeys.map((key, index) => (
              <Pie
                key={key}
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill={colors[index % colors.length]}
                dataKey={key}
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
                ))}
              </Pie>
            ))}
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h3 className="text-lg font-medium text-slate-800">{title}</h3>
        <div className="flex gap-2">
          {chartTypes.map((type) => (
            <Button
              key={type}
              variant={chartType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setChartType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}