import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { licenseKey } = await request.json();

  try {
    // Calculate hash of provided license key
    const hmac = crypto.createHmac('sha256', process.env.LICENSE_SECRET || 'fallback-secret');
    hmac.update(licenseKey);
    const licenseHash = hmac.digest('hex');

    // Look up license by hash
    const license = await prisma.license.findUnique({
      where: { key: licenseHash },
      include: { product: true }
    });

    if (!license) {
      return NextResponse.json({ valid: false }, { status: 200 });
    }

    if (license.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json({
      valid: !license.revokedAt && (!license.expiresAt || license.expiresAt > new Date()),
      productId: license.productId,
      productName: license.product.name,
      issuedAt: license.issuedAt,
      expiresAt: license.expiresAt
    });
  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
