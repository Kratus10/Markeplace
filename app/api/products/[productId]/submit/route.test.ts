/**
 * @jest-environment node
 */
import { POST } from './route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { getProductForLifecycle } from '@/lib/products/helpers';
import { logProductAudit } from '@/lib/audit/productLifecycle';

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  product: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth/authOptions', () => ({}));

jest.mock('@/lib/products/helpers', () => ({
  getProductForLifecycle: jest.fn(),
}));

jest.mock('@/lib/audit/productLifecycle', () => ({
  logProductAudit: jest.fn(),
}));

describe('POST /api/products/[id]/submit', () => {
  const productId = 'test-product-id';
  
  beforeEach(() => {
    jest.clearAllMocks();
    (logProductAudit as jest.Mock).mockResolvedValue(undefined);
  });

  it('should submit a draft product for review', async () => {
    // Mock session
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'owner-id' }
    });

    // Mock product data
    (getProductForLifecycle as jest.Mock).mockResolvedValue({
      id: productId,
      ownerId: 'owner-id',
      status: 'DRAFT',
      versions: [{ status: 'APPROVED' }]
    });

    // Mock update
    (prisma.product.update as jest.Mock).mockResolvedValue({
      id: productId,
      status: 'PENDING_REVIEW'
    });

    const req = new NextRequest(`http://localhost/api/products/${productId}/submit`, {
      method: 'POST'
    });

    const response = await POST(req, { params: { id: productId } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('PENDING_REVIEW');
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id: productId },
      data: {
        status: 'PENDING_REVIEW',
        rejectionReason: null
      }
    });
  });

  it('should return 403 for non-owner', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'other-user' }
    });

    (getProductForLifecycle as jest.Mock).mockResolvedValue({
      ownerId: 'owner-id'
    });

    const req = new NextRequest(`http://localhost/api/products/${productId}/submit`, {
      method: 'POST'
    });

    const response = await POST(req, { params: { id: productId } });
    expect(response.status).toBe(403);
  });

  it('should return 400 if not draft', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'owner-id' }
    });

    (getProductForLifecycle as jest.Mock).mockResolvedValue({
      ownerId: 'owner-id',
      status: 'PUBLISHED'
    });

    const req = new NextRequest(`http://localhost/api/products/${productId}/submit`, {
      method: 'POST'
    });

    const response = await POST(req, { params: { id: productId } });
    expect(response.status).toBe(400);
  });

  it('should return 400 if no approved versions', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: 'owner-id' }
    });

    (getProductForLifecycle as jest.Mock).mockResolvedValue({
      ownerId: 'owner-id',
      status: 'DRAFT',
      versions: [{ status: 'PENDING' }]
    });

    const req = new NextRequest(`http://localhost/api/products/${productId}/submit`, {
      method: 'POST'
    });

    const response = await POST(req, { params: { id: productId } });
    expect(response.status).toBe(400);
  });
});