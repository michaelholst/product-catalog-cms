import Link from 'next/link';
import { categories } from '@/lib/data/categories';

/**
 * CategoryNav Component (Server Component)
 *
 * Displays category navigation links.
 * This is a Server Component that fetches category data and renders navigation.
 *
 * Educational Note: Navigation components are often Server Components
 * because the category list doesn't change frequently and doesn't need interactivity.
 *
 * Props:
 * - activeCategory: Optional currently selected category slug
 */

interface CategoryNavProps {
  activeCategory?: string;
}

export function CategoryNav({ activeCategory }: CategoryNavProps) {
  return (
    <nav aria-label="Product categories">
      <div className="bg-white shadow-sm rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>

        {/* Category list */}
        <ul className="space-y-2">
          {/* All Products link */}
          <li>
            <Link
              href="/products"
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                !activeCategory
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Products
            </Link>
          </li>

          {/* Category links */}
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">
                      {category.productCount}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Horizontal Category Nav (for header/top of page)
 */
export function CategoryNavHorizontal({ activeCategory }: CategoryNavProps) {
  return (
    <nav aria-label="Product categories" className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto py-4">
          {/* All Products link */}
          <Link
            href="/products"
            className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              !activeCategory
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Products
          </Link>

          {/* Category links */}
          {categories.map((category) => {
            const isActive = activeCategory === category.slug;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs text-gray-500">
                  {category.productCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Educational Notes:
 *
 * 1. Navigation Patterns:
 *    - Vertical (sidebar) for desktop
 *    - Horizontal (top bar) for mobile/header
 *    - Both show the same data, different layouts
 *
 * 2. Active State:
 *    - Highlight current category
 *    - Visual feedback for user orientation
 *    - Conditional styling with template literals
 *
 * 3. Accessibility:
 *    - <nav> semantic element
 *    - aria-label for screen readers
 *    - <ul>/<li> for list semantics
 *    - Descriptive link text
 *
 * 4. Product Counts:
 *    - Show number of products in each category
 *    - Helps users make decisions
 *    - Denormalized data (stored in category object)
 *
 * 5. Responsive Design:
 *    - Horizontal scroll on mobile (overflow-x-auto)
 *    - Whitespace-nowrap prevents wrapping
 *    - Works on all screen sizes
 *
 * 6. Server Components:
 *    - No client-side JavaScript needed
 *    - Data fetched on server
 *    - Fast initial page load
 */
