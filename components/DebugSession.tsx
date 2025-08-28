// Debug component to check session and role
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (session) {
      setDebugInfo({
        status,
        session,
        userRole: session.user?.role,
        normalizedRole: session.user?.role?.toString().toUpperCase(),
        timestamp: new Date().toISOString()
      });
    }
  }, [session, status]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
      <h2>Session Debug Info</h2>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}