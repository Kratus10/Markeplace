/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { middleware } from './middleware'; // Import the middleware
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Mock dependencies
const mockGetToken = getToken as jest.Mock;
const mockRateLimit = jest.fn(() => ({
  success: true,
  pending: Promise.resolve(),
  limit: 100,
  reset: 12345,
  remaining: 99,
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

// The @upstash/ratelimit module is now mocked globally in __mocks__

jest.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: jest.fn(),
  },
}));

describe('Middleware', () => {
  // A helper to create mock requests
  const mockRequest = (method: string, path: string, headers: Record<string, string> = {}) => {
    const request = {
      method,
      nextUrl: {
        pathname: path,
        search: '',
        origin: 'http://localhost:3000',
      },
      headers: new Headers(headers),
      url: `http://localhost:3000${path}`,
    };
    return request as NextRequest;
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set default mock implementations
    mockRateLimit.mockResolvedValue({ success: true });
    mockGetToken.mockResolvedValue({ role: 'ADMIN' });

    // Set environment variables
    process.env.CORS_ALLOWED_ORIGIN = 'https://example.com';
  });

  it('should block unauthorized CORS requests', async () => {
    const req = mockRequest('GET', '/api/test', {
      origin: 'https://malicious.com',
    });
    const res = await middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(403);
  });

  it('should allow authorized CORS requests', async () => {
    const req = mockRequest('GET', '/api/test', {
      origin: 'https://example.com',
    });
    const res = (await middleware(req)) as NextResponse;
    // For a simple pass-through, middleware might not return a response,
    // but a new response with headers. Let's assume it returns a response.
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
  });

  it('should handle preflight OPTIONS requests', async () => {
    const req = mockRequest('OPTIONS', '/api/test', {
      origin: 'https://example.com',
    });
    const res = (await middleware(req)) as NextResponse;
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, PUT, DELETE, OPTIONS');
  });

  it('should enforce rate limiting', async () => {
    mockRateLimit.mockResolvedValue({ success: false }); // Simulate rate limit exceeded
    const req = mockRequest('POST', '/api/test', { origin: 'https://example.com' });

    const res = await middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(429);
    expect(mockRateLimit).toHaveBeenCalledWith('127.0.0.1');
  });

  it('should redirect unauthenticated users from protected routes', async () => {
    mockGetToken.mockResolvedValue(null); // Simulate no token
    const req = mockRequest('GET', '/admin/dashboard', { origin: 'https://example.com' });
    
    const res = (await middleware(req)) as NextResponse;
    expect(res.status).toBe(307); // NextResponse.redirect defaults to 307
    expect(res.headers.get('Location')).toBe('http://localhost:3000/auth/signin?callbackUrl=%2Fadmin%2Fdashboard');
  });

  it('should block non-admin users from admin routes', async () => {
    mockGetToken.mockResolvedValue({ role: 'USER' }); // Simulate non-admin user
    const req = mockRequest('GET', '/admin/dashboard', { origin: 'https://example.com' });
    
    const res = await middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(403);
  });

  it('should allow admin users to access protected routes', async () => {
    // Default mocks are already set for an admin user
    const req = mockRequest('GET', '/admin/dashboard', { origin: 'https://example.com' });
    
    const res = (await middleware(req)) as NextResponse;
    expect(res.status).toBe(200);
  });

  it('should handle token validation errors gracefully', async () => {
    mockGetToken.mockRejectedValue(new Error('Token error')); // Simulate error during token validation
    const req = mockRequest('GET', '/admin/dashboard', { origin: 'https://example.com' });
    
    const res = await middleware(req);
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(500);
  });

  it('should extract IP from x-forwarded-for header', async () => {
    const req = mockRequest('POST', '/api/test', {
      'x-forwarded-for': '192.168.1.1, 10.0.0.1',
      'origin': 'https://example.com'
    });
    
    await middleware(req);
    expect(mockRateLimit).toHaveBeenCalledWith('192.168.1.1');
  });
});