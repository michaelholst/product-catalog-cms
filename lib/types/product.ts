/**
 * Core Product Type
 *
 * This interface defines the structure of a product in our CMS.
 * In a real application, this would match the database schema.
 *
 * Educational Note: Strong typing helps catch errors at compile time
 * and makes the data structure self-documenting.
 */
export interface Product {
  // Identity fields - unique identifiers for the product
  id: string;                           // Unique identifier (like a database ID)
  slug: string;                         // URL-friendly identifier (e.g., "wireless-headphones")
  sku: string;                          // Stock Keeping Unit (inventory tracking code)

  // Basic product information
  name: string;                         // Product name displayed to users
  description: string;                  // Short description for listings
  longDescription?: string;             // Detailed description for product page

  // Pricing information
  // Educational Note: Prices stored in cents to avoid floating-point precision issues
  price: number;                        // Current price in cents (2999 = $29.99)
  originalPrice?: number;               // Original price (for showing discounts)
  currency: string;                     // Currency code (e.g., "USD", "EUR")

  // Categorization and taxonomy
  category: string;                     // Primary category slug
  subcategory?: string;                 // Optional subcategory
  tags: string[];                       // Array of tags for search and filtering

  // Inventory management
  // Educational Note: Inventory is a complex object showing real-world data relationships
  inventory: {
    inStock: boolean;                   // Quick availability check
    quantity: number;                   // Available quantity
    lowStockThreshold: number;          // Trigger for "low stock" warnings
    reservedQuantity: number;           // Items in carts but not yet purchased
  };

  // Media assets
  // Educational Note: Arrays of objects demonstrate one-to-many relationships
  images: {
    url: string;                        // Image path or URL
    alt: string;                        // Accessibility text
    isPrimary: boolean;                 // Main product image flag
  }[];

  // Metadata and flags
  featured: boolean;                    // Show on homepage
  isNew: boolean;                       // Display "new" badge
  rating?: {                            // Optional rating information
    average: number;                    // Average rating (0-5)
    count: number;                      // Number of reviews
  };

  // Flexible attributes for product-specific properties
  // Educational Note: Record type allows dynamic key-value pairs
  attributes: Record<string, string | number | boolean>;

  // Timestamps
  // Educational Note: Tracking creation and modification times is standard practice
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Category Type
 *
 * Represents a product category with hierarchical support.
 * Categories can have parent categories for nested organization.
 */
export interface Category {
  id: string;
  slug: string;                         // URL-friendly identifier
  name: string;                         // Display name
  description: string;                  // Category description
  image?: string;                       // Optional category image
  parentId?: string;                    // For hierarchical categories
  productCount: number;                 // Denormalized count for performance
}

/**
 * Filter Parameters
 *
 * Defines all possible query parameters for filtering products.
 * This demonstrates how frontend filter UI translates to backend queries.
 *
 * Educational Note: All fields are optional because filters can be combined
 * in any combination. This is common in API design.
 */
export interface FilterParams {
  category?: string;                    // Filter by category slug
  minPrice?: number;                    // Minimum price in cents
  maxPrice?: number;                    // Maximum price in cents
  inStock?: boolean;                    // Only show in-stock products
  tags?: string[];                      // Filter by tags (OR logic)
  search?: string;                      // Full-text search query
  sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest' | 'rating';
  page?: number;                        // Current page (for pagination)
  limit?: number;                       // Items per page
}

/**
 * Inventory Status
 *
 * Computed status based on inventory data.
 * This demonstrates business logic separation from raw data.
 */
export interface InventoryStatus {
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  message: string;                      // User-facing message
  canOrder: boolean;                    // Whether product can be added to cart
  urgency?: 'none' | 'medium' | 'high'; // Visual urgency indicator
}
