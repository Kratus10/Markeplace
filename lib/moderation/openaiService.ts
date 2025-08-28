import OpenAI from 'openai';
import { audit } from '@/lib/audit/audit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Platform-related keywords to detect criticism
const PLATFORM_KEYWORDS = [
  'platform', 'site', 'website', 'service', 'company',
  'marketplace', 'app', 'system', 'experience', 'interface'
];

// Enhanced content moderation with platform criticism detection
export async function moderateContent(content: string, contentType: string, adminId: string) {
  try {
    // First, use standard OpenAI moderation
    const moderation = await openai.moderations.create({ input: content });
    const results = moderation.results[0];
    
    // Then check for platform criticism using embeddings
    const isPlatformCriticism = await detectPlatformCriticism(content);
    
    // Combine results
    const categories = {
      ...results.categories,
      platform_criticism: isPlatformCriticism
    };
    
    const categoryScores = {
      ...results.category_scores,
      platform_criticism: isPlatformCriticism ? 0.9 : 0.1
    };
    
    // Create audit log
    await audit({
      action: 'content_moderation',
      entity: { id: 'N/A', type: contentType, name: 'Content Moderation' },
      status: 'SUCCESS',
      details: JSON.stringify({
        contentPreview: content.slice(0, 100),
        categories,
        categoryScores,
        flagged: results.flagged || isPlatformCriticism
      }),
      userId: adminId
    });
    
    return {
      flagged: results.flagged || isPlatformCriticism,
      categories,
      categoryScores
    };
  } catch (error) {
    console.error('OpenAI moderation failed:', error);
    await audit({
      action: 'content_moderation',
      entity: { id: 'N/A', type: contentType, name: 'Content Moderation' },
      status: 'FAILURE',
      details: `Error: ${error.message}`,
      userId: adminId
    });
    throw new Error('Content moderation service unavailable');
  }
}

// Advanced platform criticism detection using embeddings
async function detectPlatformCriticism(content: string): Promise<boolean> {
  try {
    // Check for keywords
    const containsKeyword = PLATFORM_KEYWORDS.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (!containsKeyword) return false;
    
    // Analyze sentiment with OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{
        role: 'system',
        content: 'Analyze the sentiment of this text about the platform. ' +
                 'Respond only with "negative" if it criticizes the platform, "positive" if positive, ' +
                 'or "neutral" if not relevant.'
      }, {
        role: 'user',
        content
      }],
      max_tokens: 10,
      temperature: 0
    });
    
    const sentiment = response.choices[0].message.content?.toLowerCase() || '';
    return sentiment.includes('negative');
  } catch (error) {
    console.error('Platform criticism detection failed:', error);
    return false;
  }
}
