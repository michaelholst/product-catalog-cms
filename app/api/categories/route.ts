import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/data/categories';

/**
 * GET /api/categories
 *
 * Get all product categories
 *
 * Educational Note: This is a simple metadata endpoint.
 * Categories are used to build navigation menus and filter options.
 *
 * Example URL:
 * - /api/categories - Get all categories
 *
 * Response includes:
 * - Category ID and slug (for routing)
 * - Name and description (for display)
 * - Product count (for showing "Electronics (25 items)")
 */
export async function GET(request: NextRequest) {
  try {
    // Return all categories
    // Educational: This is a simple read operation, no filtering needed
    // In a real app with many categories, you might add pagination
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling
    console.error('Error in GET /api/categories:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'INTERNAL_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Educational Notes on Metadata Endpoints:
 *
 * 1. Purpose:
 *    - Provide reference data for building UIs
 *    - Categories, tags, filters, options, etc.
 *    - Usually small datasets that change infrequently
 *
 * 2. Caching:
 *    - These endpoints are perfect for caching
 *    - Data doesn't change often
 *    - Can be cached in browser or CDN
 *    - In Next.js, use revalidate for ISR
 *
 * 3. When to Use:
 *    - Building dropdown menus
 *    - Filter options
 *    - Navigation menus
 *    - Form select options
 *
 * 4. Response Format:
 *    - Usually just an array of objects
 *    - Include ID for referencing
 *    - Include display name
 *    - Include count/metadata when useful
 *
 * 5. Performance:
 *    - Small datasets can be fetched on every request
 *    - Large datasets should be paginated
 *    - Consider embedding in main response (fewer requests)
 */
