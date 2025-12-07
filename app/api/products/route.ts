import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/api/products-service';
import { getAvailableFilterOptions } from '@/lib/api/filter-service';
import { FilterParams } from '@/lib/types/product';

/**
 * GET /api/products
 *
 * Main product listing endpoint with support for:
 * - Filtering (category, price range, stock, tags)
 * - Searching (full-text search)
 * - Sorting (price, name, date, rating)
 * - Pagination (page, limit)
 *
 * Educational Note: This is a typical REST API GET endpoint.
 * Query parameters are extracted from the URL and used to filter/sort/paginate results.
 *
 * Example URLs:
 * - /api/products - All products (first page)
 * - /api/products?category=electronics - Filter by category
 * - /api/products?minPrice=1000&maxPrice=5000 - Price range
 * - /api/products?search=headphones - Search query
 * - /api/products?sortBy=price-asc&page=2&limit=24 - Sorted and paginated
 * - /api/products?category=fashion&inStock=true&sortBy=price-desc - Combined filters
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from URL
    // Educational: searchParams is a URLSearchParams object from the URL
    const searchParams = request.nextUrl.searchParams;

    // Build filter parameters from query string
    // Educational: This demonstrates how to parse and validate query parameters
    const filters: FilterParams = {};

    // Category filter
    const category = searchParams.get('category');
    if (category) {
      filters.category = category;
    }

    // Price range filters
    // Educational: Convert string to number and validate
    const minPrice = searchParams.get('minPrice');
    if (minPrice) {
      const parsed = parseInt(minPrice, 10);
      if (!isNaN(parsed)) {
        filters.minPrice = parsed;
      }
    }

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      const parsed = parseInt(maxPrice, 10);
      if (!isNaN(parsed)) {
        filters.maxPrice = parsed;
      }
    }

    // Stock filter
    // Educational: URL params are always strings, so '1', 'true', 'yes' all mean true
    const inStock = searchParams.get('inStock');
    if (inStock) {
      filters.inStock = inStock === 'true' || inStock === '1';
    }

    // Tags filter
    // Educational: Arrays in query strings can be comma-separated
    const tags = searchParams.get('tags');
    if (tags) {
      filters.tags = tags.split(',').map(t => t.trim());
    }

    // Search query
    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }

    // Sort parameter
    const sortBy = searchParams.get('sortBy');
    if (sortBy) {
      filters.sortBy = sortBy as FilterParams['sortBy'];
    }

    // Pagination parameters
    const page = searchParams.get('page');
    if (page) {
      const parsed = parseInt(page, 10);
      if (!isNaN(parsed) && parsed > 0) {
        filters.page = parsed;
      }
    }

    const limit = searchParams.get('limit');
    if (limit) {
      const parsed = parseInt(limit, 10);
      if (!isNaN(parsed) && parsed > 0) {
        filters.limit = Math.min(parsed, 100); // Cap at 100 items
      }
    }

    // Call service to get products
    // Educational: Controllers/routes should be thin - just handle HTTP,
    // then delegate to service layer for business logic
    const result = await getProducts(filters);

    // Add available filter options to response
    // Educational: This helps the frontend build filter UI dynamically
    const availableFilters = getAvailableFilterOptions(result.data);

    // Return successful response
    // Educational: 200 OK is the standard success status code
    // We return JSON with consistent structure
    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      filters: {
        applied: filters,
        available: availableFilters,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling
    // Educational: Always handle errors gracefully in API routes
    console.error('Error in GET /api/products:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch products',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 } // 500 Internal Server Error
    );
  }
}

/**
 * Educational Notes on this Endpoint:
 *
 * 1. Query Parameters: All filters come from the URL query string
 *    - Easy to bookmark and share
 *    - SEO-friendly
 *    - Cacheable
 *
 * 2. RESTful Design: GET for read operations
 *    - Idempotent (calling it multiple times has same effect)
 *    - Safe (doesn't modify server state)
 *
 * 3. Response Structure: Consistent format
 *    - Always includes success flag
 *    - Data + metadata (pagination, filters)
 *    - Timestamp for debugging
 *
 * 4. Error Handling: Try-catch with proper status codes
 *    - 200 for success
 *    - 500 for server errors
 *    - Detailed error messages for debugging
 *
 * 5. Validation: Check and convert types
 *    - URL params are always strings
 *    - Parse numbers, validate ranges
 *    - Set sensible defaults and limits
 */
