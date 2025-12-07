import Link from 'next/link';
import { getProducts } from '@/lib/api/products-service';
import { FilterParams } from '@/lib/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { SortSelector } from '@/components/SortSelector';

/**
 * Products Listing Page (Server Component)
 *
 * Displays all products with filtering, searching, and pagination.
 * This demonstrates URL-based state management with Server Components.
 *
 * Educational Note: searchParams is automatically provided by Next.js
 * and contains all URL query parameters. When params change, this
 * component re-renders on the server with new data.
 *
 * Example URLs:
 * - /products - All products, page 1
 * - /products?page=2 - Page 2
 * - /products?category=electronics - Filter by category
 * - /products?search=headphones - Search for headphones
 * - /products?category=electronics&sortBy=price-asc&page=2 - Combined filters
 */

interface ProductsPageProps {
  searchParams: {
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    tags?: string;
    search?: string;
    sortBy?: string;
    page?: string;
    limit?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Convert URL search params to filter parameters
  // Educational: Query parameters are always strings, we need to convert them
  const filters: FilterParams = {};

  if (searchParams.category) {
    filters.category = searchParams.category;
  }

  if (searchParams.minPrice) {
    filters.minPrice = parseInt(searchParams.minPrice, 10);
  }

  if (searchParams.maxPrice) {
    filters.maxPrice = parseInt(searchParams.maxPrice, 10);
  }

  if (searchParams.inStock) {
    filters.inStock = searchParams.inStock === 'true';
  }

  if (searchParams.tags) {
    filters.tags = searchParams.tags.split(',');
  }

  if (searchParams.search) {
    filters.search = searchParams.search;
  }

  if (searchParams.sortBy) {
    filters.sortBy = searchParams.sortBy as FilterParams['sortBy'];
  }

  if (searchParams.page) {
    filters.page = parseInt(searchParams.page, 10);
  }

  if (searchParams.limit) {
    filters.limit = parseInt(searchParams.limit, 10);
  }

  // Fetch products with filters from database
  // Educational: This runs on the server for every request
  // The data is fresh and SEO-friendly
  const result = await getProducts(filters);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="mt-1 text-sm text-gray-600">
                {result.pagination.total} products available
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
        </div>

        {/* Active Filters Display */}
        {(filters.search || filters.category || filters.sortBy) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Category: {filters.category}
              </span>
            )}
            {filters.sortBy && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Sort: {filters.sortBy}
              </span>
            )}
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear all
            </Link>
          </div>
        )}

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {result.pagination.page} of {result.pagination.totalPages} pages
          </p>
          <SortSelector currentSort={filters.sortBy} />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={result.data}
          emptyMessage={
            filters.search
              ? `No products found for "${filters.search}"`
              : 'No products found'
          }
        />

        {/* Pagination */}
        <Pagination pagination={result.pagination} />
      </div>
    </main>
  );
}

/**
 * Educational Notes:
 *
 * 1. URL-based State:
 *    - All filters stored in URL query parameters
 *    - Bookmarkable, shareable links
 *    - Browser back/forward works correctly
 *    - SEO-friendly (crawlers see different filter combinations)
 *
 * 2. Server Components with Dynamic Data:
 *    - This page re-renders on server when URL changes
 *    - Fresh data on every request
 *    - No client-side state management needed
 *    - No loading spinners (server waits for data)
 *
 * 3. Type Conversion:
 *    - URL params are strings: "?page=2"
 *    - Convert to numbers: parseInt()
 *    - Convert to booleans: === 'true'
 *    - Split arrays: split(',')
 *
 * 4. Filter Composition:
 *    - Multiple filters combine with AND logic
 *    - Each filter narrows results further
 *    - Clear individual or all filters
 *
 * 5. UX Features:
 *    - Show active filters
 *    - Clear filter buttons
 *    - Result count
 *    - Sort dropdown
 *    - Empty state messaging
 */
