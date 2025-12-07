import { Product, FilterParams, InventoryStatus } from '../types/product';
import { PaginatedResponse } from '../types/api';
import { prisma } from '../db';
import { sortProducts } from './filter-service';

/**
 * Products Service - Database Version
 *
 * This is the database-backed version of the products service.
 * It uses Prisma ORM to interact with the SQLite database.
 *
 * Educational Note: This demonstrates how to migrate from in-memory data to a database.
 * The API surface remains the same, but the implementation uses database queries.
 *
 * Architecture Pattern: Service Layer with ORM
 * - Controllers/Routes call services
 * - Services contain business logic
 * - Services use Prisma to access database
 */

/**
 * Helper function to transform database product to Product type
 * Parses JSON fields stored in the database
 */
function transformDbProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    sku: dbProduct.sku,
    name: dbProduct.name,
    description: dbProduct.description,
    longDescription: dbProduct.longDescription,
    price: dbProduct.price,
    originalPrice: dbProduct.originalPrice,
    currency: dbProduct.currency,
    category: dbProduct.category,
    subcategory: dbProduct.subcategory,
    tags: JSON.parse(dbProduct.tags),
    inventory: {
      inStock: dbProduct.inStock,
      quantity: dbProduct.quantity,
      lowStockThreshold: dbProduct.lowStockThreshold,
      reservedQuantity: dbProduct.reservedQuantity,
    },
    images: JSON.parse(dbProduct.images),
    featured: dbProduct.featured,
    isNew: dbProduct.isNew,
    rating: dbProduct.ratingAverage
      ? {
          average: dbProduct.ratingAverage,
          count: dbProduct.ratingCount || 0,
        }
      : undefined,
    attributes: JSON.parse(dbProduct.attributes),
    createdAt: dbProduct.createdAt,
    updatedAt: dbProduct.updatedAt,
    publishedAt: dbProduct.publishedAt,
  };
}

/**
 * Get Products with Filters, Sorting, and Pagination
 *
 * This is the main product listing function using database queries.
 *
 * Educational Flow:
 * 1. Build WHERE clauses from filters
 * 2. Execute database query with filters
 * 3. Apply sorting (can be done in DB or in memory)
 * 4. Apply pagination with LIMIT and OFFSET
 * 5. Return formatted response with metadata
 */
export async function getProducts(
  filters: FilterParams = {}
): Promise<PaginatedResponse<Product>> {
  // Build where clause for Prisma
  const where: any = {};

  // Category filter
  if (filters.category) {
    where.category = filters.category;
  }

  // Price range filter
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  // In stock filter
  if (filters.inStock !== undefined) {
    where.inStock = filters.inStock;
  }

  // Tags filter (OR logic - product has at least one of the tags)
  if (filters.tags && filters.tags.length > 0) {
    // Since tags are stored as JSON, we need to filter in memory after fetching
    // For now, we'll fetch all matching other filters and filter tags in memory
  }

  // Search filter
  if (filters.search) {
    // Full-text search across name and description
    // Note: SQLite searches are case-insensitive by default with LIKE
    where.OR = [
      { name: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  // Pagination
  const page = filters.page || 1;
  const limit = Math.min(filters.limit || 12, 100); // Max 100 items per page
  const skip = (page - 1) * limit;

  // Fetch products from database
  const [dbProducts, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  // Transform database products to Product type
  let results = dbProducts.map(transformDbProduct);

  // Apply tags filter in memory (since tags are JSON)
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(product =>
      filters.tags!.some(tag => product.tags.includes(tag))
    );
  }

  // Apply sorting
  results = sortProducts(results, filters.sortBy);

  // Calculate pagination metadata
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get Single Product by ID
 *
 * Educational: This is like SELECT * FROM products WHERE id = ?
 */
export async function getProduct(id: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { id },
  });

  return dbProduct ? transformDbProduct(dbProduct) : null;
}

/**
 * Get Single Product by Slug
 *
 * Used for product detail pages with SEO-friendly URLs
 * Educational: Slugs are URL-friendly identifiers
 */
export async function getProductBySlugService(slug: string): Promise<Product | null> {
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
  });

  return dbProduct ? transformDbProduct(dbProduct) : null;
}

/**
 * Search Products
 *
 * Full-text search with relevance ranking
 * Educational: Uses database LIKE queries for search
 */
export async function performSearch(
  query: string,
  limit: number = 20
): Promise<{
  results: Product[];
  query: string;
  count: number;
}> {
  // Search in name, description, and tags
  // Note: SQLite searches are case-insensitive by default with LIKE
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
        { longDescription: { contains: query } },
        { tags: { contains: query } },
      ],
    },
    take: limit,
  });

  const results = dbProducts.map(transformDbProduct);

  return {
    results,
    query,
    count: results.length,
  };
}

/**
 * Get Featured Products
 *
 * Returns products marked as featured, typically for homepage
 * Educational: This is WHERE featured = true
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { featured: true },
    take: limit,
  });

  return dbProducts.map(transformDbProduct);
}

/**
 * Get New Arrivals
 *
 * Returns recently added products
 * Educational: This combines filtering and sorting with ORDER BY
 */
export async function getNewArrivals(limit: number = 12): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { isNew: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return dbProducts.map(transformDbProduct);
}

/**
 * Get Products by Category
 *
 * Educational: This is WHERE category = ?
 */
export async function getProductsByCategory(
  category: string,
  filters: FilterParams = {}
): Promise<PaginatedResponse<Product>> {
  // Add category to filters
  const categoryFilters = { ...filters, category };
  return getProducts(categoryFilters);
}

/**
 * Get Products On Sale
 *
 * Returns products with discounted prices
 * Educational: Computed field - checks if originalPrice exists and is higher
 */
export async function getProductsOnSale(limit: number = 12): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: {
      NOT: { originalPrice: null },
    },
    take: limit,
  });

  // Filter to only include products where originalPrice > price
  const results = dbProducts
    .map(transformDbProduct)
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .slice(0, limit);

  return results;
}

/**
 * Get Low Stock Products
 *
 * Products that need restocking
 * Educational: Business logic - compares quantity to threshold
 */
export async function getLowStockProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: { inStock: true },
  });

  // Filter in memory since we need to compare quantity to lowStockThreshold
  return dbProducts
    .map(transformDbProduct)
    .filter(p => p.inventory.quantity <= p.inventory.lowStockThreshold);
}

/**
 * Get Out of Stock Products
 *
 * Educational: Simple boolean filter
 */
export async function getOutOfStockProducts(): Promise<Product[]> {
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: [{ inStock: false }, { quantity: 0 }],
    },
  });

  return dbProducts.map(transformDbProduct);
}

/**
 * Calculate Inventory Status
 *
 * Determines display message and availability based on inventory data
 * Educational: This is business logic that transforms raw data into user-facing information
 */
export function getInventoryStatus(product: Product): InventoryStatus {
  const { quantity, lowStockThreshold, inStock } = product.inventory;

  // Out of stock
  if (!inStock || quantity === 0) {
    return {
      status: 'out-of-stock',
      message: 'Out of Stock',
      canOrder: false,
      urgency: 'none',
    };
  }

  // Low stock
  if (quantity <= lowStockThreshold) {
    return {
      status: 'low-stock',
      message: `Only ${quantity} left in stock`,
      canOrder: true,
      urgency: 'high',
    };
  }

  // In stock
  return {
    status: 'in-stock',
    message: 'In Stock',
    canOrder: true,
    urgency: 'none',
  };
}

/**
 * Get Product Statistics
 *
 * Aggregates data for analytics/dashboard
 * Educational: Demonstrates data aggregation using database aggregate functions
 */
export async function getProductStats() {
  // Use Prisma aggregations for better performance
  const [
    total,
    inStockCount,
    outOfStockCount,
    featuredCount,
    avgPrice,
    allProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { inStock: true } }),
    prisma.product.count({ where: { OR: [{ inStock: false }, { quantity: 0 }] } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.product.aggregate({ _avg: { price: true } }),
    prisma.product.findMany(), // Needed for low stock and inventory value
  ]);

  const products = allProducts.map(transformDbProduct);

  // Calculate low stock count
  const lowStock = products.filter(
    p => p.inventory.inStock && p.inventory.quantity <= p.inventory.lowStockThreshold
  ).length;

  // Calculate inventory value
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.inventory.quantity,
    0
  );

  return {
    totalProducts: total,
    inStock: inStockCount,
    outOfStock: outOfStockCount,
    lowStock,
    featured: featuredCount,
    averagePrice: Math.round(avgPrice._avg.price || 0),
    inventoryValue,
  };
}

/**
 * Get Related Products
 *
 * Finds products similar to the given product
 * Educational: Simple recommendation logic based on category and tags
 */
export async function getRelatedProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  // First, get products in the same category
  const dbProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      NOT: { id: product.id },
    },
    take: limit * 2, // Get more than we need to filter by tags
  });

  const products = dbProducts.map(transformDbProduct);

  // Sort by shared tags (products with more shared tags come first)
  const sorted = products.sort((a, b) => {
    const aSharedTags = a.tags.filter(tag => product.tags.includes(tag)).length;
    const bSharedTags = b.tags.filter(tag => product.tags.includes(tag)).length;
    return bSharedTags - aSharedTags;
  });

  return sorted.slice(0, limit);
}

/**
 * Format Price for Display
 *
 * Converts price from cents to formatted string
 * Educational: Utility function for consistent price formatting
 */
export function formatPrice(priceInCents: number, currency: string = 'USD'): string {
  const dollars = priceInCents / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(dollars);
}

/**
 * Calculate Discount Percentage
 *
 * Educational: Simple business calculation
 */
export function getDiscountPercentage(product: Product): number | null {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return null;
  }

  const discount =
    ((product.originalPrice - product.price) / product.originalPrice) * 100;

  return Math.round(discount);
}
