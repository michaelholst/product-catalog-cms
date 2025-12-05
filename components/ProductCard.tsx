import Link from 'next/link';
import { Product } from '@/lib/types/product';
import { formatPrice, getDiscountPercentage } from '@/lib/api/products-service';
import { AddToCartButton } from './AddToCartButton';

/**
 * ProductCard Component (Server Component)
 *
 * Displays a single product in a card format.
 * This is a Server Component - it renders on the server with zero JavaScript sent to client.
 *
 * Educational Note: Server Components are the default in Next.js App Router.
 * They're great for displaying data that doesn't need interactivity.
 *
 * Props:
 * - product: The product data to display
 */

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Calculate discount percentage if there's an original price
  const discount = getDiscountPercentage(product);

  // Get inventory status for display
  const { inStock, quantity, lowStockThreshold } = product.inventory;
  const isLowStock = inStock && quantity <= lowStockThreshold;

  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      {/* Product link area */}
      <Link href={`/products/${product.slug}`} className="flex-1">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100">
          {/* Primary image */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-gray-400 text-sm text-center">
              {product.images[0]?.alt || product.name}
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {discount && (
              <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </div>

          {/* Stock status badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-sm font-semibold px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category.replace('-', ' ')}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-xs font-medium text-gray-700 ml-1">
                  {product.rating.average.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.rating.count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice, product.currency)}
              </span>
            )}
          </div>

          {/* Stock warning */}
          {isLowStock && (
            <p className="text-xs text-orange-600 font-medium mt-2">
              Only {quantity} left!
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button - Outside link */}
      <div className="px-4 pb-4">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}

/**
 * Educational Notes:
 *
 * 1. Server Components:
 *    - Render on server, send HTML to client
 *    - No JavaScript bundle for this component
 *    - Perfect for static display components
 *    - Can directly access backend data
 *
 * 2. Component Structure:
 *    - Outer div: Card container
 *    - Link: Wraps clickable area (image + info)
 *    - Button div: Separate from link (no navigation on click)
 *
 * 3. Link Component:
 *    - Next.js <Link> for client-side navigation
 *    - Prefetches pages on hover
 *    - Faster than <a> tag
 *
 * 4. Tailwind CSS:
 *    - Utility-first CSS framework
 *    - Classes like "p-4", "text-sm", "bg-white"
 *    - Responsive with "md:", "lg:" prefixes
 *    - State variants with "hover:", "group-hover:"
 *
 * 5. Accessibility:
 *    - Semantic HTML (proper heading levels)
 *    - Alt text for images
 *    - Descriptive link text
 *    - Color contrast for text
 *
 * 6. UX Features:
 *    - Hover effects (shadow, text color)
 *    - Visual feedback (badges, stock status)
 *    - Discount display
 *    - Low stock urgency
 *    - Separate button area (doesn't trigger navigation)
 */
