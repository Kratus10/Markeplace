// FILE: lib/services/auditService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogParams {
  action: string;
  entityId?: string;
  entityType?: string;
  entityName?: string;
  status?: string;
  details?: any;
  userId?: string;
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityId: params.entityId,
        entityType: params.entityType,
        entityName: params.entityName,
        status: params.status,
        details: params.details ? JSON.stringify(params.details) : null,
        userId: params.userId
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // We don't throw here to avoid breaking the main functionality
  }
}

export async function logRoleChange(
  userId: string,
  previousRole: string,
  newRole: string,
  changedBy: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    await createAuditLog({
      action: 'USER_ROLE_CHANGED',
      entityId: userId,
      entityType: 'USER',
      entityName: user?.name || user?.email || 'Unknown User',
      status: 'SUCCESS',
      details: {
        previousRole,
        newRole,
        changedBy
      },
      userId: changedBy
    });
  } catch (error) {
    console.error('Failed to log role change:', error);
  }
}

export async function logTopicMove(
  topicId: string,
  previousCategoryId: string | null,
  newCategoryId: string,
  movedBy: string
) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });
    
    await createAuditLog({
      action: 'TOPIC_MOVED',
      entityId: topicId,
      entityType: 'TOPIC',
      entityName: topic?.title || 'Untitled Topic',
      status: 'SUCCESS',
      details: {
        previousCategoryId,
        newCategoryId,
        movedBy
      },
      userId: movedBy
    });
  } catch (error) {
    console.error('Failed to log topic move:', error);
  }
}