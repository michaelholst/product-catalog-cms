import { NextRequest, NextResponse } from 'next/server';
import { getProduct } from '@/lib/api/products-service';

/**
 * GET /api/products/[id]
 *
 * Get a single product by ID
 *
 * Educational Note: This demonstrates dynamic routing in Next.js API routes.
 * The [id] in the folder name becomes a parameter we can access.
 *
 * Example URLs:
 * - /api/products/prod_001 - Get product with ID "prod_001"
 * - /api/products/prod_042 - Get product with ID "prod_042"
 *
 * RESTful Pattern:
 * GET /api/products/:id - Get single resource
 * This is standard REST API design for resource retrieval.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract the ID from the URL parameters
    // Educational: params.id comes from the [id] folder name
    const { id } = params;

    // Validate ID
    // Educational: Always validate input, even URL parameters
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Product ID is required',
            code: 'INVALID_ID',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 } // 400 Bad Request
      );
    }

    // Fetch product from service
    // Educational: Service layer handles the business logic
    const product = getProduct(id);

    // Check if product exists
    // Educational: 404 Not Found is the correct status when resource doesn't exist
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Product with ID "${id}" not found`,
            code: 'NOT_FOUND',
          },
          timestamp: new Date().toISOString(),
        },
        { status: 404 } // 404 Not Found
      );
    }

    // Return successful response
    // Educational: 200 OK with the product data
    return NextResponse.json({
      success: true,
      data: product,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Error handling
    // Educational: Catch unexpected errors and return 500
    console.error(`Error in GET /api/products/${params?.id}:`, error);

    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Failed to fetch product',
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
 * Educational Notes on HTTP Status Codes:
 *
 * 200 OK - Success, resource found and returned
 * 400 Bad Request - Client error, invalid input (e.g., missing ID)
 * 404 Not Found - Resource doesn't exist
 * 500 Internal Server Error - Server-side error
 *
 * These status codes help clients understand what happened:
 * - 2xx = Success
 * - 4xx = Client error (fix your request)
 * - 5xx = Server error (not your fault)
 *
 * Educational Notes on Dynamic Routes:
 *
 * Next.js file system routing:
 * - [id] in folder name = dynamic parameter
 * - params.id in the handler = access the value
 * - Multiple dynamic segments possible: [category]/[id]
 *
 * This is similar to Express.js:
 * app.get('/api/products/:id', ...) - Express
 * app/api/products/[id]/route.ts - Next.js
 */
