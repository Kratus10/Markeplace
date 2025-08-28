// AI content moderation utilities
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Moderate text content using OpenAI
export async function moderateContent(content: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
  confidence: number;
}> {
  try {
    // Use OpenAI's moderation API
    const moderation = await openai.moderations.create({
      input: content,
    });
    
    const result = moderation.results[0];
    
    // Calculate overall confidence as the maximum category score
    const maxScore = Math.max(...Object.values(result.category_scores));
    
    return {
      flagged: result.flagged,
      categories: result.categories,
      categoryScores: result.category_scores,
      confidence: maxScore
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    // Return default safe values if moderation fails
    return {
      flagged: false,
      categories: {},
      categoryScores: {},
      confidence: 0
    };
  }
}

// Determine moderation action based on moderation results
export function getModerationAction(
  moderationResult: ReturnType<typeof moderateContent> extends Promise<infer T> ? T : never,
  autoModerationSettings: {
    confidenceThreshold: number;
    autoHideThreshold: number;
  }
): 'APPROVE' | 'FLAG' | 'HIDE' | 'QUARANTINE' {
  // If content is flagged by OpenAI and confidence is high, hide it
  if (moderationResult.flagged && moderationResult.confidence >= autoModerationSettings.autoHideThreshold) {
    return 'HIDE';
  }
  
  // If content is flagged by OpenAI but confidence is moderate, flag it for review
  if (moderationResult.flagged && moderationResult.confidence >= autoModerationSettings.confidenceThreshold) {
    return 'FLAG';
  }
  
  // If confidence is very high that it's problematic but not flagged by OpenAI, still flag
  if (moderationResult.confidence >= autoModerationSettings.autoHideThreshold) {
    return 'HIDE';
  }
  
  // If confidence is moderate that it's problematic, flag for review
  if (moderationResult.confidence >= autoModerationSettings.confidenceThreshold) {
    return 'FLAG';
  }
  
  // Otherwise, approve the content
  return 'APPROVE';
}

// Get human-readable moderation categories
export function getModerationCategories(moderationResult: {
  categories: Record<string, boolean>;
  categoryScores: Record<string, number>;
}): Array<{ category: string; score: number }> {
  return Object.entries(moderationResult.categoryScores)
    .map(([category, score]) => ({
      category,
      score
    }))
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 3); // Return top 3 categories
}