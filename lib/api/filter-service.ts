import { Product, FilterParams } from '../types/product';

/**
 * Filter Service
 *
 * This module contains all filtering, searching, and sorting logic.
 * In a real application with a database, these operations would be done
 * using SQL queries or database-specific query languages.
 *
 * Educational Note: We're implementing these in TypeScript to demonstrate
 * the logic behind backend filtering. Understanding this helps when working
 * with any database or API.
 */

/**
 * Filter Products by Multiple Criteria
 *
 * This function demonstrates how multiple filters combine (AND logic).
 * Each filter narrows down the results further.
 *
 * Educational Concepts:
 * - Array.filter() for filtering collections
 * - Multiple conditions with AND logic (all must be true)
 * - Different comparison types (exact match, range, contains)
 * - Boolean flags for quick filtering
 */
export function filterProducts(
  products: Product[],
  filters: FilterParams
): Product[] {
  return products.filter(product => {
    // Category filter: exact match
    // Educational: This is like "WHERE category = ?" in SQL
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range filter: numerical comparison
    // Educational: Demonstrates range queries (BETWEEN in SQL)
    // Prices are in cents to avoid floating-point issues
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false;
    }

    // Stock filter: boolean flag
    // Educational: Simple boolean filtering (useful for availability)
    if (filters.inStock && !product.inventory.inStock) {
      return false;
    }

    // Tags filter: array intersection (OR logic within tags)
    // Educational: This shows how to check if arrays have common elements
    // If ANY of the filter tags match ANY product tag, include the product
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(filterTag =>
        product.tags.includes(filterTag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Search filter: full-text search simulation
    // Educational: Real apps use search engines (Elasticsearch) or
    // database full-text search, but this demonstrates the concept
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase().trim();
      const searchableText = [
        product.name,
        product.description,
        ...product.tags,
        product.category,
      ]
        .join(' ')
        .toLowerCase();

      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    // If all filters pass, include this product
    return true;
  });
}

/**
 * Sort Products
 *
 * Implements various sorting strategies. In databases, this is ORDER BY.
 *
 * Educational Concepts:
 * - Array.sort() with custom comparator functions
 * - Immutability (creating copy before sorting)
 * - Different sort criteria (price, name, date, rating)
 * - Ascending vs descending order
 */
export function sortProducts(
  products: Product[],
  sortBy?: string
): Product[] {
  // Create a copy to avoid mutating the original array
  // Educational: Immutability is a best practice in functional programming
  const sorted = [...products];

  if (!sortBy) {
    return sorted;
  }

  switch (sortBy) {
    case 'price-asc':
      // Sort by price: lowest first
      // Educational: Numerical comparison (a - b)
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      // Sort by price: highest first
      return sorted.sort((a, b) => b.price - a.price);

    case 'name':
      // Sort alphabetically by name
      // Educational: localeCompare for proper string sorting
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case 'newest':
      // Sort by creation date: newest first
      // Educational: Date comparison using getTime()
      return sorted.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );

    case 'rating':
      // Sort by average rating: highest first
      // Educational: Handling optional fields with || operator
      return sorted.sort(
        (a, b) => (b.rating?.average || 0) - (a.rating?.average || 0)
      );

    default:
      // If sort type is not recognized, return unsorted
      return sorted;
  }
}

/**
 * Search Products with Relevance Scoring
 *
 * This implements a simple relevance-based search algorithm.
 * Real search engines (like Elasticsearch) use much more sophisticated
 * algorithms, but this demonstrates the core concept.
 *
 * Educational Concepts:
 * - Weighted scoring (different fields have different importance)
 * - Exact match vs. partial match
 * - Sorting by relevance score
 * - Multi-field search
 */
export function searchProducts(
  query: string,
  products: Product[]
): Product[] {
  const searchTerm = query.toLowerCase().trim();

  if (!searchTerm) {
    return [];
  }

  // Score each product based on how well it matches the search
  const scoredProducts = products
    .map(product => {
      let score = 0;

      // Exact match in product name: highest priority
      // Educational: Exact matches are most relevant
      if (product.name.toLowerCase() === searchTerm) {
        score += 100;
      }
      // Partial match in product name: high priority
      else if (product.name.toLowerCase().includes(searchTerm)) {
        score += 50;

        // Bonus: match at start of name
        if (product.name.toLowerCase().startsWith(searchTerm)) {
          score += 10;
        }
      }

      // Match in description: medium priority
      if (product.description.toLowerCase().includes(searchTerm)) {
        score += 20;
      }

      // Match in long description: lower priority
      if (product.longDescription?.toLowerCase().includes(searchTerm)) {
        score += 10;
      }

      // Match in tags: medium-high priority
      // Educational: Tags are important for categorization
      product.tags.forEach(tag => {
        if (tag.toLowerCase() === searchTerm) {
          score += 30; // Exact tag match
        } else if (tag.toLowerCase().includes(searchTerm)) {
          score += 10; // Partial tag match
        }
      });

      // Match in category: low priority
      if (product.category.toLowerCase().includes(searchTerm)) {
        score += 5;
      }

      // Boost score for featured products
      // Educational: Business logic can influence search relevance
      if (product.featured) {
        score += 5;
      }

      // Boost score for in-stock products
      // Educational: Availability affects relevance
      if (product.inventory.inStock) {
        score += 3;
      }

      return { product, score };
    })
    .filter(({ score }) => score > 0) // Only include matches
    .sort((a, b) => b.score - a.score) // Sort by relevance (highest first)
    .map(({ product }) => product); // Extract just the products

  return scoredProducts;
}

/**
 * Get Available Filter Options
 *
 * Analyzes a set of products to determine what filter options are available.
 * This is useful for building dynamic filter UIs.
 *
 * Educational Concept: Metadata generation from data analysis
 */
export function getAvailableFilterOptions(products: Product[]) {
  // Get unique categories
  const categories = Array.from(
    new Set(products.map(p => p.category))
  ).sort();

  // Get unique tags
  const tags = Array.from(
    new Set(products.flatMap(p => p.tags))
  ).sort();

  // Get price range
  const prices = products.map(p => p.price);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };

  return {
    categories,
    tags,
    priceRange,
  };
}
