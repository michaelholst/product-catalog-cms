import { Product, FilterParams } from './product';

/**
 * Pagination Metadata
 *
 * Standard pagination information returned with list endpoints.
 * This helps clients build pagination UI (next/prev buttons, page numbers).
 *
 * Educational Note: Pagination is essential for performance when dealing
 * with large datasets. Never return all records at once!
 */
export interface PaginationMeta {
  page: number;                         // Current page number (1-indexed)
  limit: number;                        // Items per page
  total: number;                        // Total number of items
  totalPages: number;                   // Total number of pages
  hasNext: boolean;                     // Whether there's a next page
  hasPrev: boolean;                     // Whether there's a previous page
}

/**
 * Paginated Response
 *
 * Generic type for paginated API responses.
 * Can be used for any list of items: Product[], Category[], etc.
 *
 * Educational Note: Generic types (<T>) make this reusable across
 * different data types while maintaining type safety.
 */
export interface PaginatedResponse<T> {
  data: T[];                            // Array of items for current page
  pagination: PaginationMeta;           // Pagination metadata
  filters?: {                           // Optional filter information
    applied: FilterParams;              // Filters that were applied
    available: {                        // Available filter options
      priceRange: { min: number; max: number };
      categories: string[];
      tags: string[];
    };
  };
}

/**
 * API Success Response
 *
 * Standard success response wrapper for single-item endpoints.
 * Provides consistent structure across all API responses.
 *
 * Educational Note: Wrapping responses in a standard format makes
 * client-side error handling much easier.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp: string;                    // ISO timestamp of response
}

/**
 * API Error Response
 *
 * Standard error response format.
 * Consistent error structure helps with debugging and error handling.
 *
 * Educational Note: Good error responses include enough context
 * to help developers debug issues.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;                    // Human-readable error message
    code: string;                       // Machine-readable error code
    details?: any;                      // Optional additional context
  };
  timestamp: string;
}

/**
 * Search Response
 *
 * Response format for search endpoints.
 * Includes the search query for reference and result count.
 */
export interface SearchResponse {
  results: Product[];                   // Matching products
  query: string;                        // Original search query
  count: number;                        // Number of results
  timestamp: string;
}

/**
 * Statistics Response
 *
 * Aggregated statistics about the product catalog.
 * Demonstrates data aggregation and computed values.
 *
 * Educational Note: These values are computed from the raw data,
 * showing how backends process and transform data.
 */
export interface StatsResponse {
  totalProducts: number;
  totalCategories: number;
  averagePrice: number;                 // In cents
  lowStockCount: number;                // Products below threshold
  outOfStockCount: number;              // Products with zero inventory
  featuredCount: number;
}
