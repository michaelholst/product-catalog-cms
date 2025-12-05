# Product Catalog CMS - Educational Backend Project

An educational Next.js application demonstrating backend concepts through a product catalog CMS. Perfect for designers learning backend development!

## What You'll Learn

This project teaches essential backend concepts through practical implementation:

- **API Design** - RESTful endpoints with proper HTTP methods and status codes
- **Data Filtering** - Multi-criteria filtering with AND logic
- **Pagination** - Offset-based pagination for performance
- **Search** - Full-text search with relevance scoring
- **Sorting** - Multiple sort criteria (price, name, date, rating)
- **Data Modeling** - TypeScript interfaces for type-safe data
- **Server vs Client Components** - Understanding rendering strategies
- **URL-based State** - Bookmarkable, SEO-friendly filtering

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Basic understanding of React
- Familiarity with TypeScript (helpful but not required)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── products/
│   │   ├── page.tsx             # Product listing
│   │   └── [slug]/page.tsx      # Product detail (dynamic)
│   ├── categories/
│   │   └── [category]/page.tsx  # Category page
│   └── api/                      # API Routes (Backend)
│       ├── products/route.ts    # GET /api/products
│       ├── products/[id]/route.ts
│       ├── products/search/route.ts
│       └── categories/route.ts
│
├── components/                   # React Components
│   ├── ProductCard.tsx          # Server Component
│   ├── ProductGrid.tsx          # Server Component
│   ├── CategoryNav.tsx          # Server Component
│   ├── SearchBar.tsx            # Client Component
│   └── Pagination.tsx           # Client Component
│
├── lib/                         # Business Logic
│   ├── api/                     # Backend Services
│   │   ├── products-service.ts  # Main business logic
│   │   ├── filter-service.ts    # Filtering & search
│   │   └── pagination-service.ts
│   ├── data/                    # Mock Data (simulates database)
│   │   ├── products.ts          # 60 products
│   │   └── categories.ts        # 5 categories
│   └── types/                   # TypeScript Definitions
│       ├── product.ts
│       └── api.ts
```

## Backend Concepts Explained

### 1. API Design (RESTful)

**File**: `app/api/products/route.ts`

```typescript
GET /api/products              // List all products
GET /api/products/:id          // Get single product
GET /api/products/search?q=... // Search products
GET /api/categories            // List categories
```

**Key Concepts**:
- HTTP methods (GET for reading)
- URL parameters (`/products/123`)
- Query parameters (`?page=2&sortBy=price`)
- Status codes (200 OK, 404 Not Found, 500 Error)
- JSON responses

**Learning Points**:
- REST uses URLs to identify resources
- Query parameters for filtering/sorting
- Consistent response format helps clients
- Status codes communicate what happened

### 2. Data Filtering

**File**: `lib/api/filter-service.ts`

```typescript
export function filterProducts(products: Product[], filters: FilterParams) {
  return products.filter(product => {
    // Category filter (exact match)
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Price range (numerical comparison)
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }

    // More filters...
    return true;
  });
}
```

**Key Concepts**:
- Multiple filters combine with AND logic
- Different comparison types (exact, range, contains)
- Array methods (`.filter()`, `.some()`)
- Boolean logic

**In Real Databases**: This is like SQL `WHERE` clauses:
```sql
SELECT * FROM products
WHERE category = 'electronics'
  AND price >= 1000
  AND price <= 5000
  AND in_stock = true;
```

### 3. Pagination

**File**: `lib/api/pagination-service.ts`

```typescript
export function paginateResults<T>(items: T[], page = 1, limit = 12) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    pagination: {
      page,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}
```

**Key Concepts**:
- Offset calculation: `(page - 1) × limit`
- Array slicing for current page
- Metadata for pagination UI
- Performance (don't return all items!)

**Why It Matters**:
- Page 1 with 12 items: Show items 0-11
- Page 2 with 12 items: Show items 12-23
- Prevents returning thousands of records at once

### 4. Search with Relevance Scoring

**File**: `lib/api/filter-service.ts`

```typescript
export function searchProducts(query: string, products: Product[]) {
  return products
    .map(product => {
      let score = 0;

      // Exact match in name (highest priority)
      if (product.name.toLowerCase() === query) score += 100;

      // Partial match in name
      else if (product.name.toLowerCase().includes(query)) score += 50;

      // Match in description
      if (product.description.toLowerCase().includes(query)) score += 20;

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)  // Highest score first
    .map(({ product }) => product);
}
```

**Key Concepts**:
- Weighted scoring (different fields have different importance)
- Exact matches rank higher than partial matches
- Product name more important than description
- Results sorted by relevance

**Real-World**: Search engines like Elasticsearch use much more sophisticated algorithms, but the principle is the same!

### 5. Sorting

**File**: `lib/api/filter-service.ts`

```typescript
export function sortProducts(products: Product[], sortBy?: string) {
  const sorted = [...products];  // Create copy (immutability)

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    // More options...
  }
}
```

**Key Concepts**:
- Immutability (don't modify original array)
- Custom comparator functions
- Different sort types (numerical, alphabetical, date)

**In SQL**: This is `ORDER BY`:
```sql
SELECT * FROM products ORDER BY price ASC;
SELECT * FROM products ORDER BY name;
```

### 6. Data Modeling with TypeScript

**File**: `lib/types/product.ts`

```typescript
export interface Product {
  // Identity
  id: string;
  slug: string;
  sku: string;

  // Info
  name: string;
  description: string;

  // Pricing (in cents to avoid floating-point issues!)
  price: number;
  currency: string;

  // Inventory (nested object shows relationships)
  inventory: {
    inStock: boolean;
    quantity: number;
    lowStockThreshold: number;
  };

  // More fields...
}
```

**Key Concepts**:
- Type safety prevents errors
- Self-documenting code
- Nested objects for relationships
- Optional fields with `?`

**Why Prices in Cents?**
```typescript
// WRONG: Floating point errors
0.1 + 0.2  // = 0.30000000000000004

// RIGHT: Store in cents as integers
price: 2999  // Represents $29.99
```

## Next.js Patterns Explained

### Server Components vs Client Components

**Server Components** (default):
```typescript
// No 'use client' needed
export default async function ProductsPage() {
  const products = await getProducts();  // Runs on server
  return <ProductGrid products={products} />;
}
```

**Benefits**:
- No JavaScript sent to client for this component
- Can access databases/APIs directly
- Faster initial page load
- Better for SEO

**Client Components**:
```typescript
'use client';  // This directive makes it a Client Component

export function SearchBar() {
  const [query, setQuery] = useState('');  // Can use hooks
  // Can handle events, maintain state
}
```

**When to Use Client Components**:
- Need interactivity (forms, buttons, clicks)
- Need React hooks (useState, useEffect)
- Need browser APIs (localStorage, etc.)

### URL-based State Management

**Pattern**: Store filters in URL query parameters

```typescript
// URL: /products?category=electronics&sortBy=price-asc&page=2

// Server Component receives these automatically:
function ProductsPage({ searchParams }: { searchParams: { ... } }) {
  const category = searchParams.category;  // "electronics"
  const sortBy = searchParams.sortBy;      // "price-asc"
  const page = searchParams.page;          // "2"
}
```

**Benefits**:
- Bookmarkable URLs
- Browser back/forward works
- Shareable links
- SEO-friendly
- No client-side state management needed

## API Endpoints Reference

### GET /api/products

List products with filtering, sorting, and pagination.

**Query Parameters**:
- `category` - Filter by category slug
- `minPrice` - Minimum price in cents
- `maxPrice` - Maximum price in cents
- `inStock` - Only in-stock products (true/false)
- `tags` - Comma-separated tags
- `search` - Full-text search query
- `sortBy` - Sort option (price-asc, price-desc, name, newest, rating)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 100)

**Examples**:
```
GET /api/products
GET /api/products?category=electronics
GET /api/products?minPrice=1000&maxPrice=5000
GET /api/products?search=wireless&sortBy=price-asc
GET /api/products?category=fashion&inStock=true&page=2
```

**Response**:
```json
{
  "success": true,
  "data": [...products...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 60,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "applied": { "category": "electronics" },
    "available": {
      "priceRange": { "min": 1999, "max": 59999 },
      "categories": ["electronics", "fashion", ...],
      "tags": ["wireless", "bluetooth", ...]
    }
  }
}
```

### GET /api/products/[id]

Get a single product by ID.

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "id": "prod_001",
    "name": "Wireless Headphones",
    ...
  }
}
```

**Response** (Not Found):
```json
{
  "success": false,
  "error": {
    "message": "Product not found",
    "code": "NOT_FOUND"
  }
}
```

### GET /api/products/search

Search products with relevance ranking.

**Query Parameters**:
- `q` (required) - Search query
- `limit` - Max results (default: 20, max: 100)

**Example**:
```
GET /api/products/search?q=headphones&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": {
    "results": [...products...],
    "query": "headphones",
    "count": 10
  }
}
```

### GET /api/categories

List all categories.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_electronics",
      "slug": "electronics",
      "name": "Electronics",
      "description": "...",
      "productCount": 20
    },
    ...
  ]
}
```

## How Data Flows

### Example: User Searches for "wireless headphones"

1. **User Action**: Types "wireless headphones" in search bar and hits Enter

2. **Client Component** (`SearchBar.tsx`):
   ```typescript
   // Updates URL
   router.push('/products?search=wireless+headphones');
   ```

3. **Next.js Routing**: URL change triggers page re-render

4. **Server Component** (`app/products/page.tsx`):
   ```typescript
   // Receives searchParams from URL
   const filters = { search: 'wireless headphones' };
   const result = getProducts(filters);
   ```

5. **Service Layer** (`products-service.ts`):
   ```typescript
   // Orchestrates filtering
   let results = [...products];
   results = filterProducts(results, filters);
   results = searchProducts('wireless headphones', results);
   return paginateResults(results);
   ```

6. **Filter Service** (`filter-service.ts`):
   ```typescript
   // Scores each product for relevance
   // Returns sorted by score
   ```

7. **Response**: Server Component receives data and renders

8. **HTML Sent**: Browser receives fully-rendered HTML

9. **Hydration**: Client Components become interactive

## Development Workflow

### Adding a New Filter

1. **Add to Type** (`lib/types/product.ts`):
   ```typescript
   export interface FilterParams {
     // ... existing filters
     brand?: string;  // New filter
   }
   ```

2. **Implement Logic** (`lib/api/filter-service.ts`):
   ```typescript
   if (filters.brand && product.brand !== filters.brand) {
     return false;
   }
   ```

3. **Add to API Route** (`app/api/products/route.ts`):
   ```typescript
   const brand = searchParams.get('brand');
   if (brand) {
     filters.brand = brand;
   }
   ```

4. **Use in Pages** (`app/products/page.tsx`):
   ```typescript
   // Will automatically work via searchParams!
   ```

## Performance Considerations

### Why Pagination Matters

Without pagination:
```typescript
// Returns ALL 10,000 products - SLOW!
return products;  // 5MB response, 10 second load
```

With pagination:
```typescript
// Returns only 12 products - FAST!
return products.slice(0, 12);  // 50KB response, 0.1 second load
```

### Why We Store Prices in Cents

```typescript
// JavaScript floating-point issue:
19.99 + 0.01  // = 19.999999999999998 ❌

// Solution: Store in cents (integers)
1999 + 1  // = 2000 ✓
// Convert for display: $20.00
```

## Common Backend Patterns

### 1. Service Layer Pattern

```
Controller (API Route) → Service → Data Access
```

- **Controller**: Handles HTTP (request/response)
- **Service**: Business logic
- **Data Access**: Database queries

**Example**:
```typescript
// API Route (Controller)
export async function GET(request) {
  const result = getProducts(filters);  // Calls service
  return Response.json(result);
}

// Service
export function getProducts(filters) {
  let data = [...products];  // Data access
  data = filterProducts(data, filters);  // Business logic
  return paginateResults(data);
}
```

### 2. Response Wrapping

```typescript
// Success Response
{
  success: true,
  data: {...},
  timestamp: "2024-..."
}

// Error Response
{
  success: false,
  error: {
    message: "...",
    code: "..."
  }
}
```

**Benefits**:
- Consistent structure
- Easy error handling on client
- Can add metadata (timestamp, version, etc.)

## Next Steps

### Extend This Project

1. **Add More Filters**:
   - Price range slider
   - Brand filter
   - Color filter
   - Rating filter

2. **Improve Search**:
   - Fuzzy matching ("wireles" matches "wireless")
   - Search suggestions
   - Search history

3. **Add Features**:
   - Shopping cart
   - User accounts
   - Reviews and ratings
   - Product recommendations

4. **Real Database**:
   - Connect to PostgreSQL or MongoDB
   - Use Prisma or Drizzle ORM
   - Implement real CRUD operations

5. **Advanced Pagination**:
   - Cursor-based pagination (for infinite scroll)
   - Virtual scrolling
   - Load more button

## Helpful Resources

### Learning More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about App Router
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Master TypeScript
- [REST API Design](https://restfulapi.net/) - Best practices
- [HTTP Status Codes](https://httpstatuses.com/) - What they mean

### Key Takeaways

1. **APIs are interfaces** - They let frontend and backend communicate
2. **Filtering narrows results** - Multiple filters combine with AND
3. **Pagination improves performance** - Never return everything at once
4. **Search is about relevance** - Rank results by how well they match
5. **Types prevent bugs** - TypeScript catches errors at compile time
6. **Server Components are powerful** - Less JavaScript, better performance
7. **URLs are state** - Bookmarkable, shareable, SEO-friendly

## Questions?

This is an educational project! If you have questions about how something works:

1. Check the code comments - every file has educational notes
2. Look at the console logs - they explain what's happening
3. Experiment - change values and see what happens!

Happy learning!
