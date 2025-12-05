import { Category } from '../types/product';

/**
 * Category Data
 *
 * Mock category data for the CMS.
 * In a real application, this would come from a database.
 *
 * Educational Note: This demonstrates data organization and relationships.
 * The productCount field is "denormalized" - it duplicates data for performance.
 */
export const categories: Category[] = [
  {
    id: 'cat_electronics',
    slug: 'electronics',
    name: 'Electronics',
    description: 'Cutting-edge electronic devices, gadgets, and accessories',
    image: '/images/categories/electronics.jpg',
    productCount: 20,
  },
  {
    id: 'cat_fashion',
    slug: 'fashion',
    name: 'Fashion & Apparel',
    description: 'Trendy clothing, shoes, and accessories for all occasions',
    image: '/images/categories/fashion.jpg',
    productCount: 18,
  },
  {
    id: 'cat_home',
    slug: 'home-living',
    name: 'Home & Living',
    description: 'Furniture, decor, and essentials for your living space',
    image: '/images/categories/home.jpg',
    productCount: 15,
  },
  {
    id: 'cat_sports',
    slug: 'sports-outdoors',
    name: 'Sports & Outdoors',
    description: 'Equipment and gear for active lifestyles',
    image: '/images/categories/sports.jpg',
    productCount: 12,
  },
  {
    id: 'cat_beauty',
    slug: 'beauty-health',
    name: 'Beauty & Health',
    description: 'Personal care, cosmetics, and wellness products',
    image: '/images/categories/beauty.jpg',
    productCount: 10,
  },
];

/**
 * Helper function to get category by slug
 *
 * Educational Note: Helper functions like this encapsulate common operations
 * and make code more readable and maintainable.
 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

/**
 * Helper function to get all category slugs
 * Useful for generating static params in Next.js
 */
export function getAllCategorySlugs(): string[] {
  return categories.map(cat => cat.slug);
}
