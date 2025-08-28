// FILE: app/admin/page.tsx
"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Card from "@/components/ui/Card";
import SubscriptionManagement from "@/components/admin/SubscriptionManagement";
import UserManagement from "@/components/admin/UserManagement";
import { isAdmin, isOwner } from "@/lib/auth/roleUtils";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  console.log("AdminDashboard session:", session);
  const [activeTab, setActiveTab] = useState("subscriptions");

  // Show loading state while session is being fetched
  if (status === "loading") {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-blue-500 text-2xl mb-2">⏳</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Loading...</h3>
            <p className="text-slate-600">Checking your permissions</p>
          </div>
        </Card>
      </div>
    );
  }

  // Check if user is admin using the utility function
  const userRole = session?.user?.role;
  // Ensure role is properly normalized to uppercase for comparison
  const normalizedRole = userRole?.toString().toUpperCase();
  const hasAdminAccess = normalizedRole && isAdmin(normalizedRole);
  const isUserOwner = normalizedRole && isOwner(normalizedRole);

  if (!session) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You need to be logged in to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Only OWNER should have access to this main admin page
  if (!isUserOwner) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">Only the owner can access the main admin dashboard.</p>
            <p className="text-slate-500 text-sm mt-2">Your role: {normalizedRole || 'Unknown'}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Manage subscriptions, users, and site settings
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "subscriptions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Subscription Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "users"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            User Management
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "subscriptions" && <SubscriptionManagement />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
}