import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

/**
 * Stores a nonce and returns true if it was successfully stored (i.e., didn't exist before)
 * @param key The nonce key to store
 * @param ttl Time-to-live in seconds
 * @returns Promise<boolean> True if nonce was stored, false if it already exists
 */
export async function storeNonce(key: string, ttl: number): Promise<boolean> {
  try {
    // Use SETNX to only set if not exists
    const result = await redis.setnx(key, '1');
    if (result === 1) {
      // Set expiration if we successfully set the key
      await redis.expire(key, ttl);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error storing nonce:', error);
    throw error;
  }
}
