// FILE: app/robots.txt/route.ts
import { NextResponse } from 'next/server';
import { getSiteSetting } from '@/lib/site-settings';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
  const host = process.env.SITE_URL || 'https://example.com';
  
  let robotsContent = '';
  
  if (isProduction) {
    // Get robots rules from site settings
    const robotsRules = await getSiteSetting('seo.robotsRules') || [
      { agent: '*', disallow: '/admin' },
      { agent: '*', disallow: '/account' },
      { agent: '*', disallow: '/api' }
    ];
    
    // Get sitemap configuration
    const sitemapHost = await getSiteSetting('seo.sitemapHost') || host;
    const sitemapBase = `${sitemapHost.replace(/\/$/, '')}/sitemap`;
    
    // Build robots.txt content
    robotsContent = `# Production environment\n`;
    for (const rule of robotsRules) {
      robotsContent += `User-agent: ${rule.agent}\n`;
      if (rule.disallow) robotsContent += `Disallow: ${rule.disallow}\n`;
      if (rule.allow) robotsContent += `Allow: ${rule.allow}\n`;
    }
    robotsContent += `\nSitemap: ${sitemapBase}.xml\n`;
  } else {
    robotsContent = `# Non-production environment\nUser-agent: *\nDisallow: /`;
  }

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
