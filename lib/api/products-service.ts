import { Product, FilterParams, InventoryStatus } from '../types/product';
import { PaginatedResponse } from '../types/api';
import { products, getProductById, getProductBySlug } from '../data/products';
import { filterProducts, sortProducts, searchProducts } from './filter-service';
import { paginateResults } from './pagination-service';

/**
 * Products Service
 *
 * This is the main business logic layer for product operations.
 * It orchestrates filtering, sorting, and pagination.
 *
 * Educational Note: In a real app, this would interact with a database.
 * We're using in-memory data, but the patterns are the same.
 *
 * Architecture Pattern: Service Layer
 * - Controllers/Routes call services
 * - Services contain business logic
 * - Services call data access layer (database)
 */

/**
 * Get Products with Filters, Sorting, and Pagination
 *
 * This is the main product listing function.
 * It demonstrates how multiple operations combine in a typical API endpoint.
 *
 * Educational Flow:
 * 1. Start with all products
 * 2. Apply filters (narrows results)
 * 3. Apply sorting (orders results)
 * 4. Apply pagination (limits results)
 * 5. Return formatted response
 */
export function getProducts(filters: FilterParams = {}): PaginatedResponse<Product> {
  // Step 1: Start with all products
  // Educational: In a database, this would be SELECT * FROM products
  let results = [...products];

  // Step 2: Apply filters
  // Educational: This is WHERE clauses in SQL
  results = filterProducts(results, filters);

  // Step 3: Apply sorting
  // Educational: This is ORDER BY in SQL
  results = sortProducts(results, filters.sortBy);

  // Step 4: Apply pagination
  // Educational: This is LIMIT and OFFSET in SQL
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const paginatedResponse = paginateResults(results, page, limit);

  return paginatedResponse;
}

/**
 * Get Single Product by ID
 *
 * Educational: This is like SELECT * FROM products WHERE id = ?
 */
export function getProduct(id: string): Product | null {
  const product = getProductById(id);
  return product || null;
}

/**
 * Get Single Product by Slug
 *
 * Used for product detail pages with SEO-friendly URLs
 * Educational: Slugs are URL-friendly identifiers
 */
export function getProductBySlugService(slug: string): Product | null {
  const product = getProductBySlug(slug);
  return product || null;
}

/**
 * Search Products
 *
 * Full-text search with relevance ranking
 * Educational: Real apps use search engines like Elasticsearch or Algolia
 */
export function performSearch(query: string, limit: number = 20): {
  results: Product[];
  query: string;
  count: number;
} {
  const results = searchProducts(query, products).slice(0, limit);

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
export function getFeaturedProducts(limit: number = 8): Product[] {
  return products
    .filter(p => p.featured)
    .slice(0, limit);
}

/**
 * Get New Arrivals
 *
 * Returns recently added products
 * Educational: This combines filtering and sorting
 */
export function getNewArrivals(limit: number = 12): Product[] {
  return products
    .filter(p => p.isNew)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}

/**
 * Get Products by Category
 *
 * Educational: This is WHERE category = ?
 */
export function getProductsByCategory(
  category: string,
  filters: FilterParams = {}
): PaginatedResponse<Product> {
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
export function getProductsOnSale(limit: number = 12): Product[] {
  return products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .slice(0, limit);
}

/**
 * Get Low Stock Products
 *
 * Products that need restocking
 * Educational: Business logic - compares quantity to threshold
 */
export function getLowStockProducts(): Product[] {
  return products.filter(
    p =>
      p.inventory.inStock &&
      p.inventory.quantity <= p.inventory.lowStockThreshold
  );
}

/**
 * Get Out of Stock Products
 *
 * Educational: Simple boolean filter
 */
export function getOutOfStockProducts(): Product[] {
  return products.filter(p => !p.inventory.inStock || p.inventory.quantity === 0);
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
 * Educational: Demonstrates data aggregation (like SQL aggregate functions)
 */
export function getProductStats() {
  const total = products.length;
  const inStock = products.filter(p => p.inventory.inStock).length;
  const outOfStock = products.filter(p => !p.inventory.inStock).length;
  const lowStock = getLowStockProducts().length;
  const featured = products.filter(p => p.featured).length;

  // Calculate average price
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const averagePrice = Math.round(totalPrice / total);

  // Calculate total inventory value
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.inventory.quantity,
    0
  );

  return {
    totalProducts: total,
    inStock,
    outOfStock,
    lowStock,
    featured,
    averagePrice,
    inventoryValue,
  };
}

/**
 * Get Related Products
 *
 * Finds products similar to the given product
 * Educational: Simple recommendation logic based on category and tags
 */
export function getRelatedProducts(
  product: Product,
  limit: number = 4
): Product[] {
  return products
    .filter(p => {
      // Don't include the same product
      if (p.id === product.id) return false;

      // Same category is a strong match
      if (p.category === product.category) return true;

      // Shared tags are also relevant
      const sharedTags = p.tags.filter(tag => product.tags.includes(tag));
      return sharedTags.length > 0;
    })
    .slice(0, limit);
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
