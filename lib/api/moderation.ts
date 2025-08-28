import { z } from 'zod'
import ApiClient from '@/lib/apiClient'

// Define schemas for API responses
const ModerationItemSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceId: z.string(),
  snippetHtml: z.string(),
  labels: z.array(z.string()),
  aiScore: z.number(),
  modelVersion: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  createdAt: z.string(),
  status: z.enum(['pending', 'under_review', 'quarantined', 'removed', 'approved', 'escalated']),
  assignedTo: z.string().nullable(),
  userId: z.string().nullable(),
  extra: z.any().nullable(),
})

const ModerationListSchema = z.object({
  data: z.array(ModerationItemSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  })
})

const ModerationItemDetailSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceId: z.string(),
  content: z.string(),
  sanitizedContent: z.string(),
  labels: z.array(z.string()),
  aiScore: z.number(),
  modelVersion: z.string(),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  createdAt: z.string(),
  status: z.enum(['pending', 'under_review', 'quarantined', 'removed', 'approved', 'escalated']),
  assignedTo: z.string().nullable(),
  userId: z.string().nullable(),
  explanation: z.string(),
  auditTrail: z.array(z.any()),
  similarItems: z.array(z.any()),
})

// Create API client instance
const api = new ApiClient('/api/admin/moderation')

// Fetch moderation queue
export const fetchModerationQueue = async (params = {}) => {
  const response = await api.get('/queue', params)
  return ModerationListSchema.parse(response)
}

// Fetch moderation item details
export const fetchModerationItem = async (id: string) => {
  const response = await api.get(`/item/${id}`)
  return ModerationItemDetailSchema.parse(response)
}

// Perform action on a moderation item
export const performItemAction = async (id: string, action: string, reason: string) => {
  const response = await api.post(`/item/${id}/action`, { action, reason })
  return response
}

// Perform bulk actions
export const performBulkActions = async (ids: string[], action: string, reason: string) => {
  const response = await api.post('/bulk-action', { ids, action, reason })
  return response
}
