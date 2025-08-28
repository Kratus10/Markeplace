import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client'

// Simple audit implementation
const audit = async (params: {
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
    })
  } catch (error) {
    console.error('Audit logging failed:', error)
  }
}

// Type-safe model mapper
const getPrismaModel = (
  type: 'comment' | 'topic' | 'review' | 'upload' | 'product' | 'message'
): {
  findUnique: any,
  update: any
} => {
  switch (type) {
    case 'comment': return prisma.comment
    case 'topic': return prisma.topic
    case 'review': return prisma.review
    case 'upload': return prisma.upload
    case 'product': return prisma.product
    case 'message': return prisma.message
    default: throw new Error(`Unsupported model type: ${type}`)
  }
}

// Moderation status types
type ModerationStatus = 'VISIBLE' | 'HIDDEN_BY_AI' | 'HIDDEN_BY_MOD' | 'QUARANTINED'
type AppealStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'DENIED'

// AI moderation result structure
type AIModerationResult = {
  status: string
  confidence: number
  categories: string[]
}

// Input data structure
type ModerationData = {
  type: 'comment' | 'topic' | 'review' | 'upload' | 'product' | 'message'
  content: string
  sourceId?: string
}

// Applies moderation status based on AI result
export const applyModeration = async (
  data: ModerationData,
  aiResult: AIModerationResult,
  adminId: string
) => {
  try {
    const { type, sourceId } = data
    let recordId = sourceId
    let modelName: string | null = null
    
    // Map input types to Prisma models
    switch (type) {
      case 'comment':
        modelName = 'comment'
        break
      case 'topic':
        modelName = 'topic'
        break
      case 'review':
        modelName = 'review'
        break
      case 'upload':
        modelName = 'upload' // Assuming an upload model exists
        break
      case 'product':
        modelName = 'product'
        break
      case 'message':
        modelName = 'message' // Assuming a message model exists
        break
      default:
        throw new Error(`Unsupported moderation type: ${type}`)
    }

    // Get the current record if sourceId exists
    let record = null
    if (recordId) {
      const model = getPrismaModel(type)
      record = await model.findUnique({
        where: { id: recordId }
      })
    }

    // Determine moderation status based on confidence
    let status: ModerationStatus = 'VISIBLE'
    let appealStatus: AppealStatus = 'NONE'
    
    if (aiResult.confidence > 0.9) {
      status = 'HIDDEN_BY_AI'
      appealStatus = 'PENDING'
    } else if (aiResult.confidence > 0.6) {
      status = 'VISIBLE' // Flagged for review but not auto-hidden
    }

    // Special handling for uploads (malware detection)
    if (type === 'upload' && aiResult.categories.includes('malware')) {
      status = 'QUARANTINED'
      appealStatus = 'PENDING'
    }

    // Update record if it exists
    if (recordId && record) {
      const model = getPrismaModel(type)
      const updatedRecord = await model.update({
        where: { id: recordId },
        data: {
          status,
          moderationAt: new Date(),
          moderatedBy: adminId,
          moderationReason: aiResult.categories.join(', '),
          appealStatus
        }
      })

      // Create audit log entry
      await audit({
        action: 'moderate',
        entity: { id: recordId, type: modelName, name: `Moderated ${modelName}` },
        status: 'SUCCESS',
        details: JSON.stringify({
          newStatus: status,
          appealStatus,
          categories: aiResult.categories,
          confidence: aiResult.confidence
        }),
        userId: adminId
      })

      return {
        id: recordId,
        status,
        appealStatus,
        moderatedBy: adminId,
        moderationAt: new Date().toISOString()
      }
    }

    // Return result even if no record exists (for previews)
    return {
      status,
      appealStatus,
      categories: aiResult.categories,
      confidence: aiResult.confidence
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    throw new Error(`Failed to apply moderation: ${message}`)
  }
}
