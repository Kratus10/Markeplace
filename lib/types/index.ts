export interface SiteSettings {
  siteName: string;
  siteUrl: string;
  defaultSubscriptionMonthlyCents: number;
  defaultSubscriptionYearlyCents: number;
  primaryColor: string;
  secondaryColor: string;
  featureFlags: {
    binancePay: boolean;
    virusTotal: boolean;
    manualCrypto: boolean;
  };
  socialLinks: {
    twitter?: string;
    discord?: string;
    telegram?: string;
    github?: string;
  };
}
