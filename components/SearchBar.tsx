'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * SearchBar Component (Client Component)
 *
 * Interactive search input that updates URL parameters.
 * This is a Client Component because it needs interactivity (form submission, state).
 *
 * Educational Note: The 'use client' directive makes this a Client Component.
 * It can use React hooks (useState, useEffect) and handle user interactions.
 *
 * How it works:
 * 1. User types in search box
 * 2. On form submit, update URL with search query
 * 3. URL change triggers Server Component re-render with new data
 * 4. This pattern keeps URL in sync with UI state
 */

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  // Initialize search query from URL on mount
  // Educational: This syncs component state with URL params
  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    setQuery(searchQuery);
  }, [searchParams]);

  // Handle form submission
  // Educational: Form submission updates URL, which triggers page re-render
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Build new URL with search parameter
    const params = new URLSearchParams(searchParams);

    if (query.trim()) {
      params.set('search', query.trim());
      params.set('page', '1'); // Reset to page 1 when searching
    } else {
      params.delete('search'); // Remove search param if query is empty
    }

    // Navigate to new URL
    // Educational: This triggers Server Component re-render with new filters
    router.push(`/products?${params.toString()}`);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="block w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />

        {/* Clear button (shown when there's text) */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-12 flex items-center pr-2 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {/* Search button */}
        <button
          type="submit"
          className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </div>
    </form>
  );
}

/**
 * Educational Notes:
 *
 * 1. Client Component ('use client'):
 *    - Can use React hooks
 *    - Can handle events
 *    - Can maintain local state
 *    - Runs in browser
 *
 * 2. Form Handling:
 *    - preventDefault() stops page reload
 *    - Controlled input (value from state)
 *    - onChange updates state as user types
 *    - onSubmit handles form submission
 *
 * 3. URL-based State:
 *    - Search query stored in URL (?search=query)
 *    - Makes search results bookmarkable
 *    - Browser back/forward works correctly
 *    - SEO-friendly (crawlers can see queries)
 *
 * 4. Router Integration:
 *    - useRouter() for navigation
 *    - useSearchParams() for reading URL params
 *    - router.push() for programmatic navigation
 *    - URLSearchParams for building query strings
 *
 * 5. UX Features:
 *    - Visual search icon
 *    - Clear button when text exists
 *    - Focus states (ring on focus)
 *    - Placeholder text for guidance
 *    - Reset to page 1 when searching
 *
 * 6. Accessibility:
 *    - Semantic <form> element
 *    - aria-hidden on decorative icons
 *    - Proper button types (submit/button)
 *    - Keyboard navigation (Enter to submit)
 */
