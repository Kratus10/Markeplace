// FILE: app/admin/analytics/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import AnalyticsAlerts from "@/components/analytics/AnalyticsAlerts";
import { useAnalyticsAlerts } from "@/hooks/useAnalyticsAlerts";

export default function AnalyticsOverview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts'>('overview');
  const { alerts, loading, error, acknowledgeAlert, fetchAlerts } = useAnalyticsAlerts();

  const sections = [
    {
      title: "Dashboard",
      description: "Comprehensive analytics dashboard with KPIs, charts, and insights",
      href: "/admin/analytics/dashboard",
      icon: "📊",
    },
    {
      title: "User Engagement",
      description: "Track user activity, retention, and behavior patterns",
      href: "/admin/analytics/engagement",
      icon: "👥",
    },
    {
      title: "Sales Performance",
      description: "Monitor revenue, conversion rates, and sales funnels",
      href: "/admin/analytics/sales",
      icon: "💰",
    },
    {
      title: "Product Insights",
      description: "Analyze product performance and user adoption",
      href: "/admin/analytics/products",
      icon: "📦",
    },
    {
      title: "Traffic Sources",
      description: "Understand where your visitors are coming from",
      href: "/admin/analytics/traffic",
      icon: "📈",
    },
    {
      title: "Export Reports",
      description: "Generate and download detailed analytics reports",
      href: "/admin/analytics/export",
      icon: "📥",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'outline'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeTab === 'alerts' ? 'primary' : 'outline'} 
            onClick={() => setActiveTab('alerts')}
          >
            Alerts
          </Button>
          <Button variant="outline">Schedule Report</Button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          <p className="text-slate-600 mb-8">
            Gain insights into user behavior, sales performance, and platform health through our analytics tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link key={index} href={section.href}>
                <Card className="p-6 rounded-2xl shadow-soft-lg bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">{section.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-slate-800 mb-2">{section.title}</h2>
                      <p className="text-slate-600 text-sm mb-4">{section.description}</p>
                      <div className="flex items-center text-blue-600 font-medium text-sm">
                        View details
                        <ArrowRightIcon className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">About Analytics</h2>
              <p className="text-slate-600 mb-4">
                Our analytics platform provides real-time insights into your platform's performance. 
                Track key metrics, identify trends, and make data-driven decisions to improve user engagement and business outcomes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Data Privacy</h3>
                  <p className="text-sm text-slate-600">
                    All analytics data is anonymized and aggregated to protect user privacy.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Real-time Updates</h3>
                  <p className="text-sm text-slate-600">
                    Metrics are updated in real-time with a 5-minute refresh interval.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-slate-800 mb-2">Custom Reports</h3>
                  <p className="text-sm text-slate-600">
                    Create custom reports and schedule automated delivery to your team.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Analytics Alerts</h2>
                <div className="h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border-l-4 p-4 rounded-r-lg bg-slate-100 border-slate-300 animate-pulse">
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className="text-xl mr-3">🔔</div>
                        <div className="flex-1">
                          <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-2/3 mb-1"></div>
                          <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="h-8 w-24 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : error ? (
            <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
              <div className="text-center py-8">
                <div className="text-red-500 text-2xl mb-2">⚠️</div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Alerts</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <Button variant="primary" onClick={() => fetchAlerts()}>
                  Retry
                </Button>
              </div>
            </Card>
          ) : (
            <AnalyticsAlerts 
              alerts={alerts}
              onAcknowledge={acknowledgeAlert}
              title="Analytics Alerts"
              ariaLabel="Analytics alerts panel showing system notifications and warnings"
            />
          )}
          
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Alert Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Thresholds</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Traffic Spike', threshold: '25%', enabled: true },
                    { name: 'Conversion Drop', threshold: '10%', enabled: true },
                    { name: 'Response Time', threshold: '500ms', enabled: true },
                    { name: 'Payment Failures', threshold: '3%', enabled: true },
                  ].map((threshold, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-slate-700">{threshold.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">{threshold.threshold}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={threshold.enabled}
                            onChange={() => console.log('Toggle threshold:', threshold.name)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-3">Notification Settings</h3>
                <div className="space-y-3">
                  {[
                    { method: 'Email', recipients: 'admin@example.com', enabled: true },
                    { method: 'Slack', recipients: '#analytics-alerts', enabled: false },
                    { method: 'SMS', recipients: '+1234567890', enabled: false },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <span className="text-slate-700">{setting.method}</span>
                        <span className="text-sm text-slate-500 block">{setting.recipients}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={setting.enabled}
                          onChange={() => console.log('Toggle notification:', setting.method)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-slate-700 mb-2">Silence Alerts</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">1 Hour</Button>
                    <Button variant="outline" size="sm">4 Hours</Button>
                    <Button variant="outline" size="sm">24 Hours</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}