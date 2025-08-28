import { prisma } from '@/lib/prisma';

export async function logProductAudit(
  action: string,
  actorId: string,
  productId: string,
  details: Record<string, any> = {}
) {
  return prisma.auditLog.create({
    data: {
      action,
      actorId,
      targetType: 'Product',
      targetId: productId,
      details,
    }
  });
}
