// FILE: lib/products/helpers.ts
import { prisma } from '@/lib/prisma';

export async function getAllPublishedProducts() {
  return prisma.product.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      updatedAt: true
    }
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      images: true,
      reviews: true
    }
  });
}

export async function getProductForLifecycle(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      licenses: true,
      reviews: true
    }
  });
}
