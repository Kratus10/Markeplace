// Unified session utility for NextAuth that works with both App Router and Pages Router
import { auth } from "./authOptions";
import type { GetServerSidePropsContext } from "next";
import type { NextApiRequest, NextApiResponse } from "next";

// For Pages Router (getServerSideProps context)
export async function getServerSession(ctx?: GetServerSidePropsContext) {
  if (!ctx) return auth();
  
  // Create a minimal request object for Pages Router
  const req = {
    headers: {
      cookie: ctx.req.headers.cookie || ""
    }
  } as NextApiRequest;
  
  const res = {
    setHeader: (name: string, value: string) => {},
    getHeader: (name: string) => undefined
  } as NextApiResponse;
  
  return auth(req, res);
}

// For App Router (Server Components)
export async function getAuthSession() {
  return auth();
}

export const requireAuth = async (ctx?: GetServerSidePropsContext) => {
  const session = ctx ? await getServerSession(ctx) : await getAuthSession();
  if (!session) throw new Error("Authentication required");
  return session;
};

export const requireAdmin = async (ctx?: GetServerSidePropsContext) => {
  const session = await requireAuth(ctx);
  if (!session.user || session.user.role !== "ADMIN") {
    throw new Error("Admin privileges required");
  }
  return session;
};

export const getUserRole = async (ctx?: GetServerSidePropsContext) => {
  const session = ctx ? await getServerSession(ctx) : await getAuthSession();
  return session?.user?.role || "GUEST";
};
