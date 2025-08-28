import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter } from '../rateLimiter';

// Create rate limiters for different endpoints
const profileRateLimiter = new RateLimiter({
  interval: 60000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  uniqueTokenPerInterval: 500,
});

const profileVisibilityRateLimiter = new RateLimiter({
  interval: 60000, // 1 minute
  maxRequests: 15, // 15 requests per minute
  uniqueTokenPerInterval: 500,
});

export function withRateLimit(
  handler: (request: NextRequest, context: { params: Record<string, string | string[]> }) => Promise<NextResponse>,
  limiterType: 'profile' | 'profileVisibility' = 'profile'
) {
  return async function (request: NextRequest, context: { params: Record<string, string | string[]> }) {
    try {
      // Get IP address or use a fallback
      const identifier = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
      
      // Select the appropriate rate limiter
      const rateLimiter = limiterType === 'profile' ? profileRateLimiter : profileVisibilityRateLimiter;
      
      // Check if the request is allowed
      if (!rateLimiter.isAllowed(identifier)) {
        const resetTime = rateLimiter.getResetTime(identifier);
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
        
        return NextResponse.json(
          {
            error: 'Too many requests',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': retryAfter.toString(),
              'X-RateLimit-Limit': rateLimiter['options'].maxRequests.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': resetTime.toString(),
            },
          }
        );
      }
      
      const remaining = rateLimiter.getRemainingRequests(identifier);
      const resetTime = rateLimiter.getResetTime(identifier);
      
      // Execute the handler
      const response = await handler(request, context);
      
      // Add rate limit headers to successful responses
      response.headers.set('X-RateLimit-Limit', rateLimiter['options'].maxRequests.toString());
      response.headers.set('X-RateLimit-Remaining', remaining.toString());
      response.headers.set('X-RateLimit-Reset', resetTime.toString());
      
      return response;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}