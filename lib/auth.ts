// Updated auth utility for NextAuth v5
import { auth, signIn, signOut } from "@/lib/auth/authOptions";

export const getSession = async () => {
  return await auth();
};

export { signIn, signOut };
