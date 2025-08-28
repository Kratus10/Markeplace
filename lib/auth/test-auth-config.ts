// Simple test for NextAuth v5 configuration
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Mock user for testing
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER'
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Simple test - accept any credentials
        if (credentials?.email && credentials?.password) {
          return mockUser;
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});