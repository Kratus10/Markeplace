import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';
import { NextRequest } from 'next/server';

const i18n = createInstance();
const supportedLngs = (process.env.SUPPORTED_LOCALES || 'en,es').split(',');

i18n
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => {
    return import(`@/locales/${language}/${namespace}.json`);
  }))
  .init({
    supportedLngs,
    fallbackLng: process.env.DEFAULT_LOCALE || 'en',
    ns: ['common', 'auth', 'products'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export function getActiveLocale(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const localeFromPath = supportedLngs.find(lng => pathname.startsWith(`/${lng}`));
  
  if (localeFromPath) return localeFromPath;
  
  const acceptLanguage = req.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',').map(lang => lang.split(';')[0]);
    for (const lang of preferred) {
      if (supportedLngs.includes(lang)) return lang;
      const baseLang = lang.split('-')[0];
      if (supportedLngs.includes(baseLang)) return baseLang;
    }
  }
  
  return process.env.DEFAULT_LOCALE || 'en';
}

export default i18n;
