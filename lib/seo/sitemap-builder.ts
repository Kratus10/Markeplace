// FILE: lib/seo/sitemap-builder.ts

/**
 * Builds a sitemap XML string from an array of URLs
 * @param urls Array of URL objects with metadata
 * @returns XML string for sitemap
 */
export function buildSitemapXml(urls: Array<{
  url: string;
  lastmod: string;
  changefreq?: string;
  priority?: number;
  alternates?: Array<{ hreflang: string; href: string }>;
}>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${urls.map(url => `
    <url>
      <loc>${url.url}</loc>
      <lastmod>${url.lastmod}</lastmod>
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
      ${url.alternates?.map(alt => `
        <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />
      `).join('')}
    </url>
  `).join('')}
</urlset>`;
}

/**
 * Builds a sitemap index XML string from an array of sitemap entries
 * @param sitemaps Array of sitemap entries
 * @returns XML string for sitemap index
 */
export function buildSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
    <sitemap>
      <loc>${sitemap.loc}</loc>
      ${sitemap.lastmod ? `<lastmod>${sitemap.lastmod}</lastmod>` : ''}
    </sitemap>
  `).join('')}
</sitemapindex>`;
}
