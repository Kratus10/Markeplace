import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateUniqueSlug(title: string, existingId?: string): Promise<string> {
  // Create base slug
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/-+/g, '-')         // Remove consecutive hyphens
    .substring(0, 60);           // Limit to 60 characters

  // Check for uniqueness
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: uniqueSlug,
        ...(existingId && { id: { not: existingId } })
      }
    });

    if (!existing) break;

    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export async function createSlugRedirect(oldSlug: string, newSlug: string, productId: string) {
  await prisma.slugRedirect.upsert({
    where: { oldSlug },
    update: { newSlug },
    create: {
      oldSlug,
      newSlug,
      productId
    }
  });
}
