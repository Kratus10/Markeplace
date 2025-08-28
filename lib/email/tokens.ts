import { createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';

const TOKEN_SECRET = process.env.TOKEN_HMAC_SECRET || 'default-secret';

export async function createToken(userId: string, purpose: string, ttl: number = 3600) {
  const rawToken = createHmac('sha256', TOKEN_SECRET)
    .update(`${Date.now()}${userId}${purpose}`)
    .digest('hex');
  
  const hashedToken = createHmac('sha256', TOKEN_SECRET)
    .update(rawToken)
    .digest('hex');
  
  const expiresAt = new Date(Date.now() + ttl * 1000);
  
  await prisma.token.create({
    data: {
      userId,
      purpose,
      token: hashedToken,
      expiresAt,
    }
  });
  
  return rawToken;
}

export async function verifyAndConsumeToken(rawToken: string, purpose: string) {
  const hashedToken = createHmac('sha256', TOKEN_SECRET)
    .update(rawToken)
    .digest('hex');
  
  const token = await prisma.token.findUnique({
    where: { token: hashedToken },
  });
  
  if (!token || token.purpose !== purpose || token.expiresAt < new Date()) {
    return null;
  }
  
  // Consume the token by deleting it
  await prisma.token.delete({ where: { id: token.id } });
  
  return token;
}
