import { getSiteSetting } from '@/lib/site-settings';

/**
 * Get static pages with their SEO metadata
 * @param siteUrl The base URL of the site
 * @returns Array of static page URLs with metadata
 */
export async function getStaticPages(siteUrl: string) {
  const staticPages = ['', 'about', 'contact', 'marketplace', 'forum'];
  const settings = await getSiteSetting('seo');
  
  return staticPages.map(path => ({
    url: `${siteUrl}/${path}`,
    lastmod: new Date().toISOString(),
    changefreq: settings?.defaultChangefreq || 'daily',
    priority: settings?.defaultPriority || 1.0
  }));
}
