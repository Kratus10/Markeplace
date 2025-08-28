import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/authOptions';
import { moderateContent, getModerationAction } from '@/lib/forum/aiModeration';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is admin
  if (!session?.user || (session.user.role !== 'OWNER' && session.user.role !== 'ADMIN_L1' && session.user.role !== 'ADMIN_L2')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { contentId, contentType, contentText } = await request.json();
    
    if (!contentId || !contentType || !contentText) {
      return new Response('Missing required parameters', { status: 400 });
    }
    
    // Moderate the content
    const moderationResult = await moderateContent(contentText);
    
    // Get auto-moderation settings (in a real app, these would come from SiteSettings)
    const autoModerationSettings = {
      confidenceThreshold: 0.80, // 80% confidence needed to flag
      autoHideThreshold: 0.95    // 95% confidence needed to auto-hide
    };
    
    // Determine moderation action
    const action = getModerationAction(moderationResult, autoModerationSettings);
    
    let updatedContent;
    
    // Apply moderation action
    switch (action) {
      case 'HIDE':
        if (contentType === 'topic') {
          updatedContent = await prisma.topic.update({
            where: { id: contentId },
            data: { status: 'HIDDEN_BY_AI' }
          });
        } else if (contentType === 'comment') {
          updatedContent = await prisma.comment.update({
            where: { id: contentId },
            data: { status: 'HIDDEN_BY_AI' }
          });
        }
        break;
        
      case 'FLAG':
        // For flagged content, we don't automatically hide it but log it for review
        // The content remains visible but is flagged in the admin panel
        break;
        
      case 'APPROVE':
        // Content is approved, no action needed
        break;
    }
    
    // Log moderation event
    await prisma.moderationLog.create({
      data: {
        moderatorId: session.user.id,
        targetType: contentType,
        targetId: contentId,
        action: `AI_MODERATION_${action}`,
        reason: `AI moderation result: ${moderationResult.flagged ? 'Flagged' : 'Approved'} with confidence ${moderationResult.confidence}`
      }
    });
    
    return NextResponse.json({
      success: true,
      moderationResult,
      action,
      updatedContent
    });
  } catch (error) {
    console.error('Error performing AI moderation:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

// Get moderation settings
export async function GET() {
  try {
    // In a real implementation, this would fetch from SiteSettings
    const settings = {
      aiModerationEnabled: true,
      confidenceThreshold: 0.80,
      autoHideThreshold: 0.95
    };
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching moderation settings:', error);
    return new Response('Internal server error', { status: 500 });
  }
}