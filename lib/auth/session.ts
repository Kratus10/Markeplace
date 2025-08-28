// Updated session utility for NextAuth v5
import { auth } from "./authOptions";

export const getSession = async () => {
  return auth();
};

export const requireAuth = async () => {
  const session = await getSession();
  if (!session) throw new Error("Authentication required");
  return session;
};

export const requireAdmin = async () => {
  const session = await requireAuth();
  // Safely access user.role with optional chaining
  if (session.user?.role !== "ADMIN") throw new Error("Admin privileges required");
  return session;
};
