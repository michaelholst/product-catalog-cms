import { NextRequest, NextResponse } from 'next/server';
import { performSearch } from '@/lib/api/products-service';

/**
 * GET /api/products/search
 *
 * Search products using full-text search with relevance ranking
 *
 * Educational Note: Search endpoints are often separate from list endpoints
 * because they use different algorithms (relevance scoring vs. simple filtering).
 *
 * Example URLs:
 * - /api/products/search?q=headphones - Search for "headphones"
 * - /api/products/search?q=wireless&limit=10 - Limit results to 10
 * - /api/products/search?q=black+leather - Multi-word search
 *
 * Query Parameters:
 * - q (required): Search query string
 * - limit (optional): Maximum number of results (default: 20, max: 100)
 */
export async function GET(request: NextRequest) {
  try {
    // Extract search query from URL
    // Educational: 'q' is a common convention for search queries
    // (Google, Bing, etc. all use 'q' or 'query')
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Validate query parameter
    // Educational: Search requires a query string - return 400 if missing
    if (!query || query.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Search query (q) is required',
            code: 'MISSING_QUERY',
            details: 'Provide a search query using the "q" parameter: /api/products/search?q=yourquery',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // Parse limit parameter
    // Educational: Limit prevents returning too many results (performance)
    const limitParam = searchParams.get('limit');
    let limit = 20; // Default limit

    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Cap at 100 to prevent abuse
        limit = Math.min(parsed, 100);
      }
    }

    // Perform search
    // Educational: Service layer handles the search algorithm
    const searchResult = await performSearch(query, limit);

    // Return results
    // Educational: Search responses often include the query for reference
    // and result count for UI ("Found 15 results for 'headphones'")
    return NextResponse.json({
      success: true,
      data: searchResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling
    console.error('Error in GET /api/products/search:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Search failed',
          code: 'SEARCH_ERROR',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Educational Notes on Search Endpoints:
 *
 * 1. Search vs. Filter:
 *    - Filter: Exact matches (category = "electronics")
 *    - Search: Fuzzy matches, relevance scoring
 *
 * 2. Relevance Ranking:
 *    - Results sorted by how well they match the query
 *    - Exact matches rank higher than partial matches
 *    - Product name matches rank higher than description matches
 *
 * 3. Search Performance:
 *    - Real apps use search engines (Elasticsearch, Algolia)
 *    - They pre-index data for fast searches
 *    - Our implementation is simplified but shows the concept
 *
 * 4. Query Parameter 'q':
 *    - Short, standard convention
 *    - Easy to type in URLs
 *    - Recognized by SEO tools
 *
 * 5. Result Limiting:
 *    - Always limit search results
 *    - Prevents performance issues
 *    - Encourages more specific queries
 *
 * 6. Search UX Best Practices:
 *    - Return partial matches (not just exact)
 *    - Show result count
 *    - Echo back the query
 *    - Suggest alternatives if no results (not implemented here, but good practice)
 */
