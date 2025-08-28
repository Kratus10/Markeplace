import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { prisma } from '@/lib/prisma';
import { generatePresignedDownloadUrl } from '@/lib/downloads/signUrl';

export async function POST(request: Request, { params }: { params: { licenseId: string } }) {
  const { licenseId } = params;
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get IP address and user agent for logging
  const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
  const userAgent = request.headers.get('user-agent') || '';

  try {
    // Check if license exists and belongs to user
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { product: true }
    });

    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    if (license.userId !== user.id) {
      return NextResponse.json({ error: 'License does not belong to user' }, { status: 403 });
    }

    if (license.revokedAt || (license.expiresAt && license.expiresAt < new Date())) {
      return NextResponse.json({ error: 'License is not active' }, { status: 400 });
    }

    // Get the latest approved version of the product
    // For now, we'll use the product directly since we don't have versions
    const product = license.product;
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Generate presigned URL
    const presignedUrl = await generatePresignedDownloadUrl(licenseId, license.productId);

    return NextResponse.json({ 
      presignedUrl, 
      expiresAt: new Date(Date.now() + (parseInt(process.env.DOWNLOAD_URL_TTL || '300') * 1000)).toISOString() 
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 });
  }
}
