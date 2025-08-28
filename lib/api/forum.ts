// FILE: lib/api/forum.ts
import { prisma } from '@/lib/prisma';

export async function getAllPublishedPosts() {
  return prisma.topic.findMany({
    where: {
      status: 'VISIBLE'
    },
    select: {
      id: true,
      title: true,
      updatedAt: true
    }
  });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: {
      order: 'asc'
    }
  });
}

export async function getTopicsByCategory(categoryId: string) {
  return prisma.topic.findMany({
    where: {
      status: 'VISIBLE',
      categoryId: categoryId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
