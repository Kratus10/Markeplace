import NextAuth, { type Session } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
// Create a new Prisma client instance for auth
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create auth configuration
const authOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('=== AUTHORIZE CALLED ===');
        console.log('Credentials received:', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          throw new Error("Email and password are required");
        }

        try {
          const email = credentials.email?.toString();
          if (!email) throw new Error("Invalid email format");
          
          const user = await prisma.user.findUnique({
            where: { email }
          });
          
          console.log('User found in database (from authorize):', user);

          if (!user || !user.password) {
            console.log('User not found or no password in database (from authorize)');
            throw new Error("Invalid credentials");
          }

          const password = credentials.password.toString();
          const hash = user.password || '';
          
          console.log('Comparing passwords:');
          console.log('Provided password (first 5 chars):', password.substring(0, 5) + '...');
          console.log('Stored hash (first 5 chars):', hash.substring(0, 5) + '...');
          
          const isValid = await bcrypt.compare(password, hash);
          
          console.log('Password validation result:', isValid);
          if (!isValid) {
            console.log('Invalid password');
            throw new Error("Invalid credentials");
          }

          if (user.status && user.status !== "ACTIVE") {
            throw new Error("Account is not active");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: parseInt(process.env.AUTH_SESSION_MAX_AGE_SEC || "86400"),
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback called with:', { session, token });
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      console.log('Session callback returning:', session);
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      console.log('JWT callback called with:', { token, user });
      // If this is the first time the token is being created (user just logged in)
      if (user) {
        token.id = user.id;
        // Ensure role is normalized to uppercase
        token.role = user.role?.toString().toUpperCase();
        token.name = user.name;
        token.email = user.email;
      } 
      // If the token is being refreshed, fetch the latest user data from the database
      else if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email as string },
            select: { id: true, role: true, name: true, email: true }
          });
          
          if (dbUser) {
            token.id = dbUser.id;
            // Ensure role is normalized to uppercase
            token.role = dbUser.role?.toString().toUpperCase();
            token.name = dbUser.name;
            token.email = dbUser.email;
          }
        } catch (error) {
          console.error('Error refreshing user data in JWT callback:', error);
        }
      }
      console.log('JWT callback returning:', token);
      return token;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
      },
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
export default authOptions;
