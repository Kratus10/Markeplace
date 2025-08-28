// FILE: app/admin/analytics/export/page.tsx
"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useExportAnalytics } from "@/hooks/useExportAnalytics";

interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  dateRange: 'last7' | 'last30' | 'last90' | 'thisYear' | 'lastYear' | 'custom';
  includeUnredacted: boolean;
  includeCharts: boolean;
  emailNotification: string;
}

export default function ExportReports() {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: 'last30',
    includeUnredacted: false,
    includeCharts: true,
    emailNotification: '',
  });

  const { isExporting, exportError, exportReport } = useExportAnalytics();
  const [exportHistory, setExportHistory] = useState([
    { id: 1, date: '2024-02-28', format: 'CSV', status: 'Completed', size: '2.4 MB' },
    { id: 2, date: '2024-02-21', format: 'Excel', status: 'Completed', size: '3.1 MB' },
    { id: 3, date: '2024-02-14', format: 'PDF', status: 'Completed', size: '1.8 MB' },
    { id: 4, date: '2024-02-07', format: 'CSV', status: 'Failed', size: '-' },
  ]);

  const handleExport = async () => {
    try {
      await exportReport(exportOptions);
      
      // Add to export history
      const newExport = {
        id: exportHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        format: exportOptions.format.toUpperCase(),
        status: 'Completed',
        size: exportOptions.format === 'csv' ? '2.6 MB' : exportOptions.format === 'excel' ? '3.2 MB' : '1.9 MB'
      };
      
      setExportHistory([newExport, ...exportHistory]);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Export Reports</h1>
        <Button 
          variant="primary" 
          onClick={handleExport} 
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>

      {exportError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {exportError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Export Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Format</h3>
                <div className="space-y-3">
                  {(['csv', 'excel', 'pdf'] as const).map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={exportOptions.format === format}
                        onChange={(e) => setExportOptions({...exportOptions, format: e.target.value as any})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-slate-700 capitalize">{format}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Date Range</h3>
                <div className="space-y-3">
                  {[
                    { value: 'last7', label: 'Last 7 days' },
                    { value: 'last30', label: 'Last 30 days' },
                    { value: 'last90', label: 'Last 90 days' },
                    { value: 'thisYear', label: 'This year' },
                    { value: 'lastYear', label: 'Last year' },
                    { value: 'custom', label: 'Custom range' },
                  ].map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="dateRange"
                        value={range.value}
                        checked={exportOptions.dateRange === range.value}
                        onChange={(e) => setExportOptions({...exportOptions, dateRange: e.target.value as any})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-slate-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeUnredacted}
                      onChange={(e) => setExportOptions({...exportOptions, includeUnredacted: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-3 text-slate-700">
                      Include unredacted data
                      {!exportOptions.includeUnredacted && (
                        <span className="text-sm text-slate-500 block">Personal data will be redacted/anonymized</span>
                      )}
                    </span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeCharts}
                      onChange={(e) => setExportOptions({...exportOptions, includeCharts: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-3 text-slate-700">
                      Include charts and visualizations
                      <span className="text-sm text-slate-500 block">Only applies to PDF and Excel formats</span>
                    </span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email notification
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={exportOptions.emailNotification}
                      onChange={(e) => setExportOptions({...exportOptions, emailNotification: e.target.value})}
                    />
                    <p className="mt-1 text-sm text-slate-500">
                      Receive email when export is complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Export History</h2>
            
            <div className="space-y-4">
              {exportHistory.map((exportItem) => (
                <div key={exportItem.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-800">{exportItem.date}</h3>
                      <p className="text-sm text-slate-600">{exportItem.format} • {exportItem.size}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      exportItem.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : exportItem.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {exportItem.status}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm" fullWidth>
                      {exportItem.status === 'Completed' ? 'Download' : 'Retry'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-slate-700 mb-3">Scheduled Reports</h3>
              <p className="text-slate-600 text-sm mb-4">
                Automate regular report generation and delivery
              </p>
              <Button variant="outline" fullWidth>
                Schedule New Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <div className="mt-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Governance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">GDPR Compliance</h3>
              <p className="text-sm text-slate-600">
                All exported data complies with GDPR requirements
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Access Control</h3>
              <p className="text-sm text-slate-600">
                Only authorized administrators can export sensitive data
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Audit Trail</h3>
              <p className="text-sm text-slate-600">
                All export activities are logged for compliance purposes
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}