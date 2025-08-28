// FILE: app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { getSiteSetting } from '@/lib/site-settings';
import { buildSitemapXml, buildSitemapIndex } from '@/lib/seo/sitemap-builder';
import { getAllPublishedProducts } from '@/lib/products/helpers';
import { getAllPublishedPosts } from '@/lib/api/forum';
import { getStaticPages } from '@/lib/seo/helpers';

export const revalidate = Number(process.env.SITEMAP_REVALIDATE_SEC || 300);

export async function GET() {
  try {
    // Get site settings
    const siteSettings = await getSiteSetting('seo');
    const siteUrl = process.env.SITE_URL || 'https://example.com';
    const splitThreshold = siteSettings?.sitemapSplitThreshold || 45000;
    const maxPerSitemap = siteSettings?.maxUrlsPerSitemap || 50000;
    const includes = siteSettings?.sitemapIncludes || ['pages', 'products', 'forum'];
    
    // Collect URLs from all sources
    const urls = [];
    
    if (includes.includes('pages')) {
      urls.push(...(await getStaticPages(siteUrl)));
    }
    
    if (includes.includes('products')) {
      const products = await getAllPublishedProducts();
      urls.push(...products.map(product => ({
        url: `${siteUrl}/products/${product.id}`,
        lastmod: product.updatedAt.toISOString(),
        changefreq: siteSettings?.defaultChangefreq || 'weekly',
        priority: siteSettings?.defaultPriority || 0.8
      })));
    }
    
    if (includes.includes('forum')) {
      const posts = await getAllPublishedPosts();
      urls.push(...posts.map(post => ({
        url: `${siteUrl}/forum/topic/${post.id}`,
        lastmod: post.updatedAt.toISOString(),
        changefreq: siteSettings?.defaultChangefreq || 'weekly',
        priority: siteSettings?.defaultPriority || 0.7
      })));
    }
    
    // Add hreflang data if available
    if (siteSettings?.hreflangMappings) {
      urls.forEach(url => {
        url.alternates = siteSettings.hreflangMappings.map(locale => ({
          href: `${locale.url}${url.url.replace(siteUrl, '')}`,
          hreflang: locale.language
        }));
      });
    }
    
    // Check if we need to split sitemaps
  if (urls.length > splitThreshold) {
    const sitemaps = [];
    const sitemapCount = Math.ceil(urls.length / maxPerSitemap);
    
    for (let i = 0; i < sitemapCount; i++) {
      const start = i * maxPerSitemap;
      const end = start + maxPerSitemap;
      sitemaps.push({
        loc: `${siteUrl}/sitemap-${i}.xml`,
        lastmod: new Date().toISOString()
      });
    }
    
    // Generate sitemap index
    const xml = buildSitemapIndex(sitemaps);
      
      return new NextResponse(xml, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
      });
    }
    
    // Generate single sitemap
    const xml = buildSitemapXml(urls);
    return new NextResponse(xml, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return new NextResponse('<error>Sitemap generation failed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
  }
}
