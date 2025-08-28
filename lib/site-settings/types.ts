export type SiteSettingsKey = 
  | 'seo.defaultChangefreq' 
  | 'seo.defaultPriority'
  | 'seo.robotsRules'
  | 'seo.hreflangMappings'
  | 'seo.sitemapIncludes'
  | 'seo.sitemapSplitThreshold'
  | 'seo.maxUrlsPerSitemap'
  | 'seo.ogTemplate'
  | string; // Allow for future expansion

export type SiteSettingsValue<T extends SiteSettingsKey> = 
  T extends 'seo.defaultChangefreq' ? string :
  T extends 'seo.defaultPriority' ? number :
  T extends 'seo.robotsRules' ? Array<{ agent: string; disallow?: string; allow?: string }> :
  T extends 'seo.hreflangMappings' ? Array<{ language: string; url: string }> :
  T extends 'seo.sitemapIncludes' ? string[] :
  T extends 'seo.sitemapSplitThreshold' ? number :
  T extends 'seo.maxUrlsPerSitemap' ? number :
  T extends 'seo.ogTemplate' ? {
    defaultBackground: string;
    fonts: {
      title: { family: string; weight: number };
      description: { family: string; weight: number };
    };
    colors: {
      background: string;
      title: string;
      description: string;
    };
  } :
  any; // Fallback type
