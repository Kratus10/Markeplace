import { prisma } from '@/lib/prisma';

// Simple AI moderation rules (in a real implementation, this would use an AI service)
const HATE_SPEECH_KEYWORDS = [
  'hate', 'racist', 'discriminat', 'bigot', 'nazi', 'kkk', 'white power',
  'terrorist', 'extremist', 'violence', 'kill', 'murder', 'harass'
];

const PROFANITY_KEYWORDS = [
  'fuck', 'shit', 'damn', 'hell', 'bitch', 'asshole', 'bastard'
];

const SPAM_KEYWORDS = [
  'click here', 'free money', 'win now', 'urgent', 'act now', 'limited time',
  'guarantee', 'no risk', 'cash bonus', 'make money'
];

export async function moderateContent(content: string, userId: string, targetType: string, targetId: string) {
  try {
    // Convert to lowercase for matching
    const lowerContent = content.toLowerCase();
    
    // Check for hate speech
    const hasHateSpeech = HATE_SPEECH_KEYWORDS.some(keyword => 
      lowerContent.includes(keyword)
    );
    
    // Check for profanity
    const hasProfanity = PROFANITY_KEYWORDS.some(keyword => 
      lowerContent.includes(keyword)
    );
    
    // Check for spam
    const hasSpam = SPAM_KEYWORDS.some(keyword => 
      lowerContent.includes(keyword)
    );
    
    // If any red flags found, create a moderation log
    if (hasHateSpeech || hasProfanity || hasSpam) {
      const reason = [];
      if (hasHateSpeech) reason.push('Hate speech detected');
      if (hasProfanity) reason.push('Profanity detected');
      if (hasSpam) reason.push('Spam content detected');
      
      // Create moderation log
      await prisma.moderationLog.create({
        data: {
          userId,
          targetType,
          targetId,
          action: 'REPORT',
          reason: reason.join(', '),
          status: 'PENDING'
        }
      });
      
      // For hate speech, immediately hide the content
      if (hasHateSpeech) {
        if (targetType === 'TOPIC') {
          await prisma.topic.update({
            where: { id: targetId },
            data: { status: 'HIDDEN_BY_AI' }
          });
        } else if (targetType === 'COMMENT') {
          await prisma.comment.update({
            where: { id: targetId },
            data: { status: 'HIDDEN_BY_AI' }
          });
        }
        
        return { 
          flagged: true, 
          hidden: true,
          reason: 'Hate speech detected - content automatically hidden'
        };
      }
      
      return { 
        flagged: true, 
        hidden: false,
        reason: reason.join(', ')
      };
    }
    
    return { flagged: false, hidden: false, reason: null };
  } catch (error) {
    console.error('AI Moderation error:', error);
    return { flagged: false, hidden: false, reason: null };
  }
}

// Function to check if a user should be banned based on their content
export async function checkUserForBan(userId: string) {
  try {
    // Count recent moderation flags for this user
    const recentFlags = await prisma.moderationLog.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });
    
    // If user has more than 5 flags in 30 days, consider banning
    if (recentFlags > 5) {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      // Only ban if not already banned and not an admin
      if (user && user.status !== 'BANNED' && user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: userId },
          data: { status: 'BANNED' }
        });
        
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('User ban check error:', error);
    return false;
  }
}