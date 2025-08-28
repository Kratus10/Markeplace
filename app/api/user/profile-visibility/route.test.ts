/**
 * @jest-environment node
 */
import { GET, PUT } from './route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the auth function
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    profileVisibility: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Profile Visibility API Routes', () => {
  const mockGetServerSession = require('next-auth').getServerSession;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/user/profile-visibility', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/user/profile-visibility', {
        method: 'PUT',
        body: JSON.stringify({ showRole: false }),
      });

      const response = await PUT(req);
      expect(response.status).toBe(401);
    });

    it('should update profile visibility settings if authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
      });

      const updatedProfileVisibility = {
        userId: 'user123',
        showRole: false,
        showLocation: true,
        showOccupation: false,
        showBirthday: true,
        showTradingExperience: false,
        showAvatar: true,
      };

      (prisma.profileVisibility.upsert as jest.Mock).mockResolvedValue(updatedProfileVisibility);

      const req = new NextRequest('http://localhost:3000/api/user/profile-visibility', {
        method: 'PUT',
        body: JSON.stringify({ showRole: false, showOccupation: false, showTradingExperience: false }),
      });

      const response = await PUT(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.profileVisibility.showRole).toBe(false);
      expect(data.profileVisibility.showOccupation).toBe(false);
      expect(data.profileVisibility.showTradingExperience).toBe(false);
    });
  });

  describe('GET /api/user/profile-visibility', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/user/profile-visibility', {
        method: 'GET',
      });

      const response = await GET(req);
      expect(response.status).toBe(401);
    });

    it('should return profile visibility settings if authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
      });

      const profileVisibility = {
        userId: 'user123',
        showRole: true,
        showLocation: true,
        showOccupation: true,
        showBirthday: true,
        showTradingExperience: true,
        showAvatar: true,
      };

      (prisma.profileVisibility.findUnique as jest.Mock).mockResolvedValue(profileVisibility);

      const req = new NextRequest('http://localhost:3000/api/user/profile-visibility', {
        method: 'GET',
      });

      const response = await GET(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.profileVisibility.showRole).toBe(true);
    });

    it('should return default visibility settings if none exist', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: 'user123' },
      });

      (prisma.profileVisibility.findUnique as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest('http://localhost:3000/api/user/profile-visibility', {
        method: 'GET',
      });

      const response = await GET(req);
      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.profileVisibility.showRole).toBe(true);
      expect(data.profileVisibility.showLocation).toBe(true);
    });
  });
});