import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { License, Product } from '@prisma/client';

type GenerateLicenseParams = {
  product: Product;
  userId: string;
  orderId: string;
};

export async function generateLicense({ product, userId, orderId }: GenerateLicenseParams) {
  // Generate raw license key
  const rawLicense = `${product.id}-${userId}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  
  // Hash license using HMAC-SHA256 with secret key
  const hmac = crypto.createHmac('sha256', process.env.LICENSE_SECRET || 'fallback-secret');
  hmac.update(rawLicense);
  const licenseHash = hmac.digest('hex');

  // Create license in database
  const license = await prisma.license.create({
    data: {
      keyHash: licenseHash,
      productId: product.id,
      userId,
      status: 'ACTIVE',
    }
  });

  // Create audit log for license issuance
  await prisma.auditLog.create({
    data: {
      action: 'LICENSE_ISSUED',
      actorId: 'system',
      targetType: 'LICENSE',
      targetId: license.id,
      details: {
        productId: product.id,
        userId,
        orderId
      }
    }
  });

  // Return both raw and hashed license (raw will be emailed, hash is stored)
  return { rawLicense, license };
}
