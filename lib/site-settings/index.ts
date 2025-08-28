import { SiteSettingsKey, SiteSettingsValue } from './types';
import { prisma } from '@/lib/prisma';

/**
 * Fetches a site setting by key
 * @param key The setting key to retrieve
 * @returns The value of the setting or null if not found
 */
export async function getSiteSetting<T extends SiteSettingsKey>(
  key: T
): Promise<SiteSettingsValue<T> | null> {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key }
    });
    return setting?.value as SiteSettingsValue<T> || null;
  } catch (error) {
    console.error(`Error fetching site setting "${key}":`, error);
    return null;
  }
}

/**
 * Updates or creates a site setting
 * @param key The setting key to update
 * @param value The new value for the setting
 * @returns The updated setting
 */
export async function setSiteSetting<T extends SiteSettingsKey>(
  key: T,
  value: SiteSettingsValue<T>
) {
  try {
    return await prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
  } catch (error) {
    console.error(`Error updating site setting "${key}":`, error);
    throw new Error('Failed to update site setting');
  }
}

/**
 * Get all site settings
 * @returns All site settings as key-value pairs
 */
export async function getAllSiteSettings(): Promise<Record<SiteSettingsKey, any>> {
  try {
    const settings = await prisma.siteSettings.findMany();
    const result: Record<SiteSettingsKey, any> = {};
    
    settings.forEach(setting => {
      result[setting.key as SiteSettingsKey] = setting.value;
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching all site settings:', error);
    return {};
  }
}

/**
 * Initialize default SEO settings if they don't exist
 */
export async function initDefaultSEOSettings() {
  const defaultSettings: Partial<Record<SiteSettingsKey, any>> = {
    'seo.defaultChangefreq': 'weekly',
    'seo.defaultPriority': 0.5,
    'seo.robotsRules': [
      { agent: '*', disallow: '/admin' },
      { agent: '*', disallow: '/account' },
      { agent: '*', disallow: '/api' },
    ],
    'seo.hreflangMappings': [
      { language: 'en', url: process.env.SITE_URL || 'https://example.com' }
    ],
    'seo.sitemapIncludes': ['products', 'pages', 'forum'],
    'seo.sitemapSplitThreshold': 45000,
    'seo.maxUrlsPerSitemap': 50000,
    'seo.ogTemplate': {
      defaultBackground: 'OG_TEMPLATE_BG_1',
      fonts: {
        title: { family: 'Inter', weight: 700 },
        description: { family: 'Inter', weight: 400 },
      },
      colors: {
        background: '#ffffff',
        title: '#1a202c',
        description: '#4a5568',
      }
    }
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const existing = await getSiteSetting(key as SiteSettingsKey);
    if (!existing) {
      await setSiteSetting(key as SiteSettingsKey, value);
    }
  }
}
