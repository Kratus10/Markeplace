import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    // Generate client secret (show only once)
    const clientSecret = randomBytes(24).toString('hex');

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        name,
        secret: clientSecret,
      },
    });

    return new Response(JSON.stringify({ 
      clientId: client.id, 
      clientSecret,
      createdAt: client.createdAt
    }), { status: 201 });
  } catch (error) {
    console.error('Create client error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create client' }), { status: 500 });
  }
}
