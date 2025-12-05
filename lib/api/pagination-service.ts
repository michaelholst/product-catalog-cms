import { PaginatedResponse, PaginationMeta } from '../types/api';

/**
 * Pagination Service
 *
 * Handles pagination logic for API endpoints.
 * Pagination is essential for performance - never return thousands of records at once!
 *
 * Educational Concepts:
 * - Offset-based pagination (most common)
 * - Page calculation mathematics
 * - Metadata for building pagination UI
 * - Performance considerations
 */

/**
 * Paginate an array of items
 *
 * This demonstrates offset-based pagination, the most common type.
 * Other types include cursor-based (for infinite scroll) and keyset pagination.
 *
 * Educational Breakdown:
 * - Page 1 with limit 12: items 0-11
 * - Page 2 with limit 12: items 12-23
 * - Formula: startIndex = (page - 1) × limit
 *
 * @param items - Array of items to paginate
 * @param page - Current page number (1-indexed, not 0-indexed)
 * @param limit - Number of items per page
 * @returns Paginated response with data and metadata
 */
export function paginateResults<T>(
  items: T[],
  page: number = 1,
  limit: number = 12
): PaginatedResponse<T> {
  // Validate and normalize inputs
  // Educational: Always validate user input!
  const currentPage = Math.max(1, Math.floor(page)); // Ensure page >= 1
  const itemsPerPage = Math.min(Math.max(1, Math.floor(limit)), 100); // Cap at 100

  // Calculate pagination metadata
  // Educational: These calculations are standard for pagination
  const total = items.length;
  const totalPages = Math.ceil(total / itemsPerPage);

  // Calculate which items to return
  // Educational: This is the "offset" in database terms
  // OFFSET = (page - 1) × limit
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the array to get current page items
  // Educational: Array.slice() is like SQL LIMIT and OFFSET
  const data = items.slice(startIndex, endIndex);

  // Build pagination metadata
  // Educational: This helps clients build pagination UI (prev/next buttons, page numbers)
  const pagination: PaginationMeta = {
    page: currentPage,
    limit: itemsPerPage,
    total,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };

  return {
    data,
    pagination,
  };
}

/**
 * Get pagination offset
 *
 * Helper function to calculate offset for database queries.
 * In SQL: SELECT * FROM products LIMIT ? OFFSET ?
 *
 * Educational: This is how pagination works in databases
 */
export function getOffset(page: number, limit: number): number {
  const validPage = Math.max(1, Math.floor(page));
  const validLimit = Math.max(1, Math.floor(limit));
  return (validPage - 1) * validLimit;
}

/**
 * Build pagination links
 *
 * Generate URLs for prev/next/first/last pages.
 * Useful for REST API HATEOAS principles.
 *
 * Educational: HATEOAS = Hypermedia as the Engine of Application State
 * It means APIs should provide links to related resources
 */
export function buildPaginationLinks(
  baseUrl: string,
  currentPage: number,
  totalPages: number,
  queryParams?: Record<string, string>
): {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
} {
  const params = new URLSearchParams(queryParams);

  const links: Record<string, string> = {};

  // First page link
  if (currentPage > 1) {
    params.set('page', '1');
    links.first = `${baseUrl}?${params.toString()}`;
  }

  // Previous page link
  if (currentPage > 1) {
    params.set('page', String(currentPage - 1));
    links.prev = `${baseUrl}?${params.toString()}`;
  }

  // Next page link
  if (currentPage < totalPages) {
    params.set('page', String(currentPage + 1));
    links.next = `${baseUrl}?${params.toString()}`;
  }

  // Last page link
  if (currentPage < totalPages) {
    params.set('page', String(totalPages));
    links.last = `${baseUrl}?${params.toString()}`;
  }

  return links;
}

/**
 * Calculate page numbers for pagination UI
 *
 * Generates an array of page numbers to display in pagination controls.
 * Uses "window" approach to avoid showing all pages when there are many.
 *
 * Example with currentPage=5, totalPages=20, windowSize=5:
 * Returns: [3, 4, 5, 6, 7]
 *
 * Educational: This creates the "..." effect in pagination UIs
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  windowSize: number = 5
): number[] {
  if (totalPages <= windowSize) {
    // If total pages fit in window, return all
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const halfWindow = Math.floor(windowSize / 2);
  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, currentPage + halfWindow);

  // Adjust if we're near the start
  if (currentPage <= halfWindow) {
    endPage = Math.min(windowSize, totalPages);
  }

  // Adjust if we're near the end
  if (currentPage >= totalPages - halfWindow) {
    startPage = Math.max(1, totalPages - windowSize + 1);
  }

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
}
