import { SiteSettingsKey, SiteSettingsValue } from '@/lib/site-settings/types';
import { getSiteSetting } from '@/lib/site-settings';

/**
 * Builds SEO metadata for a page
 * @param params Object containing page data and site settings
 * @returns SEO metadata for the page
 */
export async function getSeoForPage({
  type,
  data,
  path,
  override = {}
}: {
  type: 'page' | 'product' | 'article' | 'topic';
  data: any;
  path: string;
  override?: Record<string, any>;
}) {
  // Get global site settings
  const siteSettings = await getSiteSetting('seo') || {};

  // Extract relevant settings
  const siteName = siteSettings.siteName || 'My Site';
  const siteUrl = process.env.SITE_URL || 'https://example.com';
  const defaultDescription = siteSettings.defaultDescription || 'Default site description';

  // Define page-specific defaults
  const defaults: Record<string, any> = {
    page: {
      title: data.title ? `${data.title} · ${siteName}` : siteName,
      description: data.description || defaultDescription
    },
    product: {
      title: data.name ? `${data.name} · ${siteName}` : siteName,
      description: data.description || defaultDescription
    },
    article: {
      title: data.title ? `${data.title} · ${siteName}` : siteName,
      description: data.summary || defaultDescription
    },
    topic: {
      title: data.title ? `${data.title} · ${siteName}` : siteName,
      description: data.excerpt || defaultDescription
    }
  };

  // Apply overrides from admin panel
  const title = override.title || defaults[type]?.title || siteName;
  const description = override.description || defaults[type]?.description || defaultDescription;
  const canonical = override.canonical || `${siteUrl}${path}`;
  const robotsMeta = override.robotsMeta || 'index, follow';
  const ogImage = override.ogImage || `${siteUrl}/api/seo/og?title=${encodeURIComponent(title)}`;
  
  // Create OpenGraph object
  const openGraph = {
    title,
    description,
    url: canonical,
    images: [{ url: ogImage }],
    siteName
  };

  // Create Twitter card object
  const twitter = {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage]
  };

  return {
    title,
    description,
    canonical,
    robotsMeta,
    openGraph,
    twitter
  };
}
