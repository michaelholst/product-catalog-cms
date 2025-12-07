import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlugService, formatPrice, getDiscountPercentage, getInventoryStatus, getRelatedProducts } from '@/lib/api/products-service';
import { getAllProductSlugs } from '@/lib/data/products';
import { ProductGrid } from '@/components/ProductGrid';

/**
 * Product Detail Page (Server Component)
 *
 * Shows detailed information for a single product.
 * This demonstrates dynamic routing with [slug] parameter.
 *
 * Educational Note: The [slug] folder name creates a dynamic route.
 * Next.js passes the slug as a parameter to this component.
 *
 * Example URLs:
 * - /products/wireless-noise-cancelling-headphones
 * - /products/gaming-mechanical-keyboard-rgb
 */

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Fetch product by slug from database
  // Educational: await works directly in Server Components
  const product = await getProductBySlugService(params.slug);

  // Show 404 if product not found
  // Educational: notFound() is a Next.js function that shows the 404 page
  if (!product) {
    notFound();
  }

  // Calculate derived data
  const discount = getDiscountPercentage(product);
  const inventoryStatus = getInventoryStatus(product);
  const relatedProducts = await getRelatedProducts(product, 4);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Products
          </Link>
        </div>
      </header>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-400 mb-2">Product Image</p>
                <p className="text-sm text-gray-500">{product.images[0]?.alt || product.name}</p>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Category */}
              <div className="mb-2">
                <Link
                  href={`/categories/${product.category}`}
                  className="text-sm text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                >
                  {product.category.replace('-', ' ')}
                </Link>
              </div>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-xl">★</span>
                    <span className="text-lg font-medium text-gray-700 ml-1">
                      {product.rating.average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatPrice(product.price, product.currency)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice, product.currency)}
                    </span>
                  )}
                  {discount && (
                    <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                      Save {discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-6">{product.description}</p>

              {product.longDescription && (
                <p className="text-gray-600 text-sm mb-6">{product.longDescription}</p>
              )}

              {/* Inventory Status */}
              <div className="mb-6">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                    inventoryStatus.status === 'in-stock'
                      ? 'bg-green-100 text-green-800'
                      : inventoryStatus.status === 'low-stock'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {inventoryStatus.message}
                </div>
              </div>

              {/* Attributes */}
              {Object.keys(product.attributes).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-200 py-2">
                        <dt className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
                        <dd className="text-sm font-medium text-gray-900">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU and Product ID */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>SKU: {product.sku}</p>
                <p>Product ID: {product.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </main>
  );
}

/**
 * Generate Static Params (Optional)
 *
 * This function tells Next.js which dynamic routes to pre-render at build time.
 * Educational: This is for Static Site Generation (SSG) - pages generated at build time.
 *
 * For production apps with many products, you might:
 * - Only pre-render popular products
 * - Use ISR (Incremental Static Regeneration)
 * - Use dynamic rendering for all products
 */
export async function generateStaticParams() {
  const slugs = getAllProductSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

/**
 * Educational Notes:
 *
 * 1. Dynamic Routes:
 *    - [slug] folder creates dynamic route
 *    - params.slug contains the URL segment
 *    - Multiple dynamic segments possible: [category]/[slug]
 *
 * 2. 404 Handling:
 *    - notFound() shows 404 page
 *    - Proper HTTP status code (404)
 *    - Good for SEO and user experience
 *
 * 3. Static Site Generation:
 *    - generateStaticParams() pre-renders pages
 *    - Fast page loads (HTML ready)
 *    - Good for SEO
 *    - Can combine with ISR for updates
 *
 * 4. Derived Data:
 *    - Calculate data from product (discount, inventory status)
 *    - Business logic in service layer
 *    - Keep components clean
 *
 * 5. Related Products:
 *    - Simple recommendation algorithm
 *    - Based on category and tags
 *    - Encourages browsing
 *    - Cross-selling opportunity
 *
 * 6. SEO Benefits:
 *    - Server-rendered content
 *    - Semantic HTML
 *    - Descriptive text
 *    - Structured data opportunities
 */
