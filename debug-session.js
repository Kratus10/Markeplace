// Debug script to check session and user matching
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return res.status(401).json({ error: 'No session found' });
    }
    
    console.log('Session user:', session.user);
    
    // Try to find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    console.log('Database user:', user);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found in database',
        sessionId: session.user.id,
        sessionUser: session.user
      });
    }
    
    return res.status(200).json({ 
      message: 'User found',
      sessionUser: session.user,
      databaseUser: user
    });
  } catch (error) {
    console.error('Debug error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}