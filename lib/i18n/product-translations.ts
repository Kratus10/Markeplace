import { prisma } from '@/lib/prisma';

interface ProductTranslationInput {
  title: string;
  description: string;
  meta?: any;
}

export async function getProductWithTranslations(productId: string, locale: string) {
  // Try to get the specific translation
  const translation = await prisma.productTranslation.findUnique({
    where: {
      productId_locale: {
        productId,
        locale,
      },
    },
  });
  
  if (translation) {
    return {
      title: translation.title,
      description: translation.description,
      meta: translation.meta,
    };
  }
  
  // If no specific translation, try base language (e.g. 'es' for 'es-MX')
  const baseLocale = locale.split('-')[0];
  if (baseLocale !== locale) {
    const baseTranslation = await prisma.productTranslation.findUnique({
      where: {
        productId_locale: {
          productId,
          locale: baseLocale,
        },
      },
    });
    
    if (baseTranslation) {
      return {
        title: baseTranslation.title,
        description: baseTranslation.description,
        meta: baseTranslation.meta,
      };
    }
  }
  
  // If no translations found, return null
  return null;
}

export async function upsertProductTranslation(
  productId: string, 
  locale: string, 
  data: ProductTranslationInput
) {
  return prisma.productTranslation.upsert({
    where: {
      productId_locale: {
        productId,
        locale,
      },
    },
    update: data,
    create: {
      productId,
      locale,
      ...data,
    },
  });
}
