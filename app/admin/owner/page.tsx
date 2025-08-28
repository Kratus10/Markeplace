// FILE: app/admin/owner/page.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import Card from "@/components/ui/Card";
import OwnerPanel from "@/components/admin/OwnerPanel";
import { isOwner } from "@/lib/auth/roleUtils";

export default async function OwnerDashboard() {
  const session = await getServerSession(authOptions);

  // Check if user is owner using the utility function
  const userRole = session?.user?.role;
  // Ensure role is properly normalized to uppercase for comparison
  const normalizedRole = userRole?.toString().toUpperCase();
  const hasOwnerAccess = normalizedRole && isOwner(normalizedRole);

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

  if (!hasOwnerAccess) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You don't have permission to access this page.</p>
            <p className="text-slate-500 text-sm mt-2">Your role: {normalizedRole || 'Unknown'}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Owner Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Manage site-wide settings and featured content
        </p>
      </div>

      <OwnerPanel />
    </div>
  );
}