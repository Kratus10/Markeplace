/**
 * Generates JSON-LD structured data for products
 * @see https://developers.google.com/search/docs/appearance/structured-data/product
 */
export function generateProductJSONLD(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "sku": product.id,
    "url": `${process.env.SITE_URL}/products/${product.slug}`,
    "offers": {
      "@type": "Offer",
      "price": product.price / 100,
      "priceCurrency": "USD",
      "availability": product.status === 'PUBLISHED' 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    }
  };
}

/**
 * Generates JSON-LD structured data for articles
 */
export function generateArticleJSONLD(article: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.summary,
    "datePublished": article.publishedAt,
    "author": {
      "@type": "Person",
      "name": article.authorName
    }
  };
}
