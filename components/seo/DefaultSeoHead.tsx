import { getSiteSetting } from '@/lib/site-settings';

/**
 * Default SEO meta tags that apply site-wide
 */
export default async function DefaultSeoHead() {
  const siteSettings = await getSiteSetting('seo') || {};
  const siteName = siteSettings.siteName || 'My Site';
  const siteDescription = siteSettings.defaultDescription || 'Default site description';
  const siteUrl = process.env.SITE_URL || 'https://example.com';

  return (
    <>
      <title>{siteName}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      <meta property="og:site_name" content={siteName} />
    </>
  );
}
