import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";

export const getSession = async () => {
  return await getServerSession(authOptions);
};

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");
  return session;
};

export const requireAdmin = async () => {
  const session = await requireAuth();
  if (session.user?.role !== "ADMIN") throw new Error("Admin privileges required");
  return session;
};
