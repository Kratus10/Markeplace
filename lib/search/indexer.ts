import { prisma } from '@/lib/prisma';
import { MeiliSearch } from 'meilisearch';

// Initialize MeiliSearch client
const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_API_KEY,
});

// Product index name
const PRODUCT_INDEX = 'products';

export async function indexProduct(productId: string) {
  try {
    // Fetch product with necessary fields
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!product) {
      console.error(`Product not found: ${productId}`);
      return;
    }

    // Only index published products
    if (product.status !== 'PUBLISHED') {
      return;
    }

    // Add or update product in search index
    await client.index(PRODUCT_INDEX).addDocuments([product]);
    console.log(`Indexed product: ${productId}`);
  } catch (error) {
    console.error(`Error indexing product ${productId}:`, error);
  }
}

export async function removeProductFromIndex(productId: string) {
  try {
    // Remove product from search index
    await client.index(PRODUCT_INDEX).deleteDocument(productId);
    console.log(`Removed product from index: ${productId}`);
  } catch (error) {
    console.error(`Error removing product ${productId} from index:`, error);
  }
}
