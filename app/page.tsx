import Link from 'next/link';
import { getFeaturedProducts } from '@/lib/api/products-service';
import { categories } from '@/lib/data/categories';
import { ProductGrid } from '@/components/ProductGrid';
import { CategoryNavHorizontal } from '@/components/CategoryNav';
import { CartButton } from '@/components/CartButton';
import { Testimonials } from '@/components/Testimonials';
import { FlyingGryphon } from '@/components/FlyingGryphon';

/**
 * Homepage (Server Component)
 *
 * The main landing page showing featured products and categories.
 * This is a Server Component that fetches data directly.
 *
 * Educational Note: In Next.js App Router, pages are Server Components by default.
 * They can fetch data directly without useEffect or client-side fetching.
 */

export default async function HomePage() {
  // Fetch featured products
  // Educational: async/await works directly in Server Components!
  // No need for useEffect, useState, or loading states
  const featuredProducts = getFeaturedProducts(8);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Flying Gryphon Animation */}
      <FlyingGryphon />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Catalog CMS</h1>
              <p className="mt-2 text-sm text-gray-600">
                Educational demo: Backend concepts with Next.js
              </p>
            </div>
            <CartButton />
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <CategoryNavHorizontal />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Store</h2>
          <p className="text-lg mb-6 opacity-90">
            Discover our curated collection of products across electronics, fashion, home & living, and more.
          </p>
          <div className="flex gap-4">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse All Products
            </Link>
            <Link
              href="/products?search="
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Search
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-600">Handpicked items just for you</p>
            </div>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View all →
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </section>

        {/* Categories Grid */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.productCount} items</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
          <Testimonials />
        </section>

        {/* Educational Info */}
        <section className="mt-12 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Educational Project</h2>
          <p className="text-gray-700 mb-4">
            This is an educational CMS demonstrating backend concepts like:
          </p>
          <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
            <li>✓ API Design & RESTful patterns</li>
            <li>✓ Data filtering & searching</li>
            <li>✓ Pagination & sorting</li>
            <li>✓ Server vs Client Components</li>
            <li>✓ Type-safe data models</li>
            <li>✓ URL-based state management</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

/**
 * Educational Notes:
 *
 * 1. Server Components:
 *    - This page is a Server Component (default in App Router)
 *    - Can use async/await directly
 *    - Fetches data on server
 *    - No client-side JavaScript for data fetching
 *
 * 2. Data Fetching:
 *    - Direct function calls (not fetch/API)
 *    - No loading states needed
 *    - No useEffect needed
 *    - Data available immediately
 *
 * 3. Component Composition:
 *    - Uses ProductGrid (Server Component)
 *    - Uses CategoryNavHorizontal (Server Component)
 *    - Modular, reusable components
 *
 * 4. SEO Benefits:
 *    - Content rendered on server
 *    - Crawlers see full HTML
 *    - Fast initial page load
 *    - Good Core Web Vitals
 */
