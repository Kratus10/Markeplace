// FILE: app/test-owner-access/page.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { isAdmin, isAdminL1, isOwner } from "@/lib/auth/roleUtils";

export default async function TestOwnerAccess() {
  const session = await getServerSession(authOptions);
  
  // Check roles using proper utility functions
  const userRole = session?.user?.role;
  const isAdminResult = userRole && isAdmin(userRole);
  const isOwnerResult = userRole && isOwner(userRole);
  const isAdminL1Result = userRole && isAdminL1(userRole);

  return (
    <div className="p-6">
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Owner Access Test</h1>
          
          {session ? (
            <div className="text-left">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Access Verification</h3>
              <div className="bg-slate-50 p-4 rounded-lg mb-4">
                <p><strong>User Role:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{userRole || "N/A"}</span></p>
                <p className="mt-2"><strong>Has Admin Access:</strong> <span className={`font-mono px-2 py-1 rounded ${isAdminResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isAdminResult ? 'YES' : 'NO'}</span></p>
                <p><strong>Has Owner Access:</strong> <span className={`font-mono px-2 py-1 rounded ${isOwnerResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isOwnerResult ? 'YES' : 'NO'}</span></p>
                <p><strong>Has Admin L1 Access:</strong> <span className={`font-mono px-2 py-1 rounded ${isAdminL1Result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{isAdminL1Result ? 'YES' : 'NO'}</span></p>
              </div>
              
              <div className="flex flex-col gap-4 mt-6">
                <Link 
                  href="/admin" 
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                >
                  Go to Admin Dashboard
                </Link>
                <Link 
                  href="/admin/l1" 
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
                >
                  Go to Admin L1 Dashboard
                </Link>
                <Link 
                  href="/admin/owner" 
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  Go to Owner Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-red-500 text-2xl mb-2">⚠️</div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Not Authenticated</h3>
              <p className="text-slate-600">You are not logged in.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}