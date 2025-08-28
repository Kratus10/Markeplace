import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { moderateContent } from '@/lib/moderation/openaiService'
import { applyModeration } from '@/lib/moderation/applyStatus'

const schema = z.object({
  type: z.enum(['comment', 'topic', 'review', 'upload', 'product', 'message']),
  content: z.string(),
  sourceId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !['OWNER', 'ADMIN_L1', 'ADMIN_L2'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const data = schema.safeParse(body)
    if (!data.success) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    // Call OpenAI moderation service
    const moderationResult = await moderateContent(data.data.content, data.data.type, user.id)
    const flagged = moderationResult.flagged
    
    // Prepare AI result for applyModeration
    const aiResult = {
      status: flagged ? 'UNSAFE' : 'SAFE',
      confidence: flagged ? 0.95 : 0.1,
      categories: Object.keys(moderationResult.categories).filter(
        category => (moderationResult.categories as Record<string, boolean>)[category]
      )
    }

    // Apply moderation to DB
    const moderationResponse = await applyModeration(data.data, aiResult, user.id)

    return NextResponse.json(moderationResponse)
  } catch (error) {
    console.error('Moderation check failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
