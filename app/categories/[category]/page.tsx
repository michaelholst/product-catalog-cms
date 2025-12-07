import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/api/products-service';
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/data/categories';
import { FilterParams } from '@/lib/types/product';
import { ProductGrid } from '@/components/ProductGrid';
import { Pagination } from '@/components/Pagination';
import { SearchBar } from '@/components/SearchBar';
import { SortSelector } from '@/components/SortSelector';

/**
 * Category Page (Server Component)
 *
 * Shows products filtered by category.
 * This demonstrates dynamic routing combined with filtering.
 *
 * Educational Note: This combines:
 * - Dynamic routing ([category] parameter)
 * - URL search parameters (for pagination, sorting)
 * - Server-side filtering
 *
 * Example URLs:
 * - /categories/electronics
 * - /categories/fashion?sortBy=price-asc
 * - /categories/home-living?page=2
 */

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    search?: string;
    sortBy?: string;
    page?: string;
    limit?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Get category data
  const category = getCategoryBySlug(params.category);

  // Show 404 if category doesn't exist
  if (!category) {
    notFound();
  }

  // Build filter parameters
  // Educational: Category from URL path, other filters from query params
  const filters: FilterParams = {
    category: params.category,
  };

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

  // Fetch products for this category from database
  const result = await getProductsByCategory(params.category, filters);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          <p className="mt-1 text-sm text-gray-600">{category.description}</p>
          <p className="mt-1 text-sm text-gray-500">
            {result.pagination.total} products in this category
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar />
          {filters.search && (
            <p className="mt-2 text-sm text-gray-600">
              Searching in {category.name} for "{filters.search}"
            </p>
          )}
        </div>

        {/* Sort Options */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {result.pagination.page} of {result.pagination.totalPages}
          </p>
          <SortSelector currentSort={filters.sortBy} />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={result.data}
          emptyMessage={`No products found in ${category.name}`}
        />

        {/* Pagination */}
        <Pagination pagination={result.pagination} />

        {/* Category Info */}
        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About {category.name}</h2>
          <p className="text-gray-700">{category.description}</p>
          <div className="mt-4">
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Browse all categories →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/**
 * Generate Static Params
 *
 * Pre-render category pages at build time.
 * Educational: This makes category pages very fast to load.
 */
export async function generateStaticParams() {
  const categorySlugs = getAllCategorySlugs();

  return categorySlugs.map((category) => ({
    category,
  }));
}

/**
 * Educational Notes:
 *
 * 1. Nested Filtering:
 *    - Category from URL path (required)
 *    - Additional filters from query params (optional)
 *    - Clean, hierarchical URL structure
 *
 * 2. Dynamic Routes + Search Params:
 *    - params: Path segments ([category])
 *    - searchParams: Query string (?sortBy=price-asc)
 *    - Both available in Server Components
 *
 * 3. SEO Benefits:
 *    - Clean URLs: /categories/electronics
 *    - Descriptive titles and descriptions
 *    - Server-rendered content
 *    - Each category is a separate page
 *
 * 4. User Experience:
 *    - Category-specific search
 *    - Category description
 *    - Easy navigation back to all products
 *    - Consistent filtering/sorting interface
 *
 * 5. Static Generation:
 *    - Pre-render all category pages
 *    - Very fast page loads
 *    - Good for SEO
 *    - Can use ISR for updates
 */
