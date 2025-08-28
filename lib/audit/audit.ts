import { prisma } from '@/lib/prisma';

export const audit = async (params: {
  action: string;
  entity: { id: string; type: string; name: string };
  status: 'SUCCESS' | 'FAILURE';
  details: string;
  userId: string;
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityId: params.entity.id,
        entityType: params.entity.type,
        entityName: params.entity.name,
        status: params.status,
        details: params.details,
        userId: params.userId
      }
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}
