import { Product } from '@/lib/types/product';
import { ProductCard } from './ProductCard';

/**
 * ProductGrid Component (Server Component)
 *
 * Displays a responsive grid of product cards.
 * This is a simple layout component that wraps ProductCard components.
 *
 * Educational Note: This demonstrates component composition - building
 * complex UIs from simple, reusable components.
 *
 * Props:
 * - products: Array of products to display
 * - emptyMessage: Optional message to show when no products (default: "No products found")
 */

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products found',
}: ProductGridProps) {
  // Handle empty state
  // Educational: Always handle edge cases (empty arrays, null, etc.)
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Grid container with responsive columns */}
      {/* Educational: Tailwind responsive grid
       *   - grid: CSS Grid layout
       *   - grid-cols-1: 1 column on mobile
       *   - sm:grid-cols-2: 2 columns on small screens (640px+)
       *   - md:grid-cols-3: 3 columns on medium screens (768px+)
       *   - lg:grid-cols-4: 4 columns on large screens (1024px+)
       *   - gap-6: Space between grid items
       */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Product count indicator */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </p>
      </div>
    </div>
  );
}

/**
 * Educational Notes:
 *
 * 1. Component Composition:
 *    - ProductGrid contains ProductCard components
 *    - Each component has a single responsibility
 *    - Grid handles layout, Card handles display
 *    - Easy to test and maintain
 *
 * 2. Props and TypeScript:
 *    - Interface defines expected props
 *    - Type safety prevents errors
 *    - Optional props with default values
 *
 * 3. Responsive Design:
 *    - Mobile-first approach (start with 1 column)
 *    - Add columns at breakpoints
 *    - CSS Grid automatically handles spacing
 *
 * 4. Empty States:
 *    - Always handle no-data scenarios
 *    - Provide helpful messages
 *    - Guide users on what to do next
 *
 * 5. Key Prop:
 *    - Required when rendering lists in React
 *    - Use stable, unique identifiers (product.id)
 *    - Never use array index as key
 *
 * 6. Accessibility:
 *    - Semantic HTML
 *    - Clear messaging
 *    - Descriptive text
 */
