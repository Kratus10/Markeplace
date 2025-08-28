import type { Session } from "next-auth";
import nextAuth from "next-auth";
import { authOptions } from "./authOptions";

export const getAuthSession = async (): Promise<Session | null> => {
  return await nextAuth(authOptions).auth();
};

export const getServerSession = getAuthSession;

export const requireAuth = async () => {
  const session = await getAuthSession();
  if (!session || !session.user) throw new Error("Authentication required");
  return session;
};

export const requireAdmin = async () => {
  const session = await requireAuth();
  if (!session.user || session.user.role !== "ADMIN") {
    throw new Error("Admin privileges required");
  }
  return session;
};
