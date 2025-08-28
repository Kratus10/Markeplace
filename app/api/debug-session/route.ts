// FILE: app/api/debug-session/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }
    
    return NextResponse.json({
      message: "Session found",
      session: session
    });
  } catch (error) {
    console.error("Debug session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}