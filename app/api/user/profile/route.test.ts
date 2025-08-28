/**
 * @jest-environment node
 */
import { GET, PUT } from './route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the auth function
jest.mock('@/lib/auth/authOptions', () => ({
  auth: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    subscription: {
      findFirst: jest.fn(),
    },
    earningsLedger: {
      findMany: jest.fn(),
    },
    profileVisibility: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Profile API Routes', () => {
  const mockAuth = require('@/lib/auth/authOptions').auth;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/user/profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      });

      const response = await GET(req);
      expect(response.status).toBe(401);
    });

    it('should return user profile data if authenticated', async () => {
      const mockUser = {
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Software developer',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuth.mockResolvedValue({
        user: { id: 'user123' },
      });

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.subscription.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.earningsLedger.findMany as jest.Mock).mockResolvedValue([]);

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'GET',
      });

      const response = await GET(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.id).toBe('user123');
      expect(data.name).toBe('John Doe');
    });
  });

  describe('PUT /api/user/profile', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: 'John Doe' }),
      });

      const response = await PUT(req);
      expect(response.status).toBe(401);
    });

    it('should update user profile if authenticated', async () => {
      mockAuth.mockResolvedValue({
        user: { id: 'user123' },
      });

      const updatedUser = {
        id: 'user123',
        name: 'John Doe Updated',
        email: 'john@example.com',
      };

      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const req = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: 'John Doe Updated' }),
      });

      const response = await PUT(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.name).toBe('John Doe Updated');
    });
  });
});