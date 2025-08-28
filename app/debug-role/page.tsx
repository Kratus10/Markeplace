// FILE: app/debug-role/page.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/auth/authOptions";
import Card from "@/components/ui/Card";

export default async function DebugRolePage() {
  // Get server-side session
  const serverSession = await getServerSession(authOptions);
  
  return (
    <div className="p-6">
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white mb-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Server-Side Session</h1>
          
          {serverSession ? (
            <div className="text-left">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Session Details</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p><strong>User ID:</strong> {serverSession?.user?.id || "N/A"}</p>
                <p><strong>Name:</strong> {serverSession?.user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {serverSession?.user?.email || "N/A"}</p>
                <p className="mt-2"><strong>Role:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{serverSession?.user?.role || "N/A"}</span></p>
                <p className="mt-2"><strong>Full Session Object:</strong></p>
                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-x-auto">
                  {JSON.stringify(serverSession, null, 2)}
                </pre>
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
      
      {/* Client-side session component */}
      <ClientSessionComponent />
    </div>
  );
}

// Client component for client-side session
function ClientSessionComponent() {
  const { data: clientSession, status } = useSession();
  
  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Client-Side Session</h1>
        
        {status === "loading" ? (
          <p>Loading session...</p>
        ) : status === "unauthenticated" ? (
          <div>
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Not Authenticated</h3>
            <p className="text-slate-600">You are not logged in.</p>
          </div>
        ) : (
          <div className="text-left">
            <h3 className="text-lg font-medium text-slate-800 mb-4">Session Details</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p><strong>User ID:</strong> {clientSession?.user?.id || "N/A"}</p>
              <p><strong>Name:</strong> {clientSession?.user?.name || "N/A"}</p>
              <p><strong>Email:</strong> {clientSession?.user?.email || "N/A"}</p>
              <p className="mt-2"><strong>Role:</strong> <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{clientSession?.user?.role || "N/A"}</span></p>
              <p className="mt-2"><strong>Full Session Object:</strong></p>
              <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(clientSession, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}