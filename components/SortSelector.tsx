'use client';

import { useRouter, useSearchParams } from 'next/navigation';

/**
 * SortSelector Component (Client Component)
 *
 * Dropdown for selecting sort order.
 * This is a Client Component because it needs interactivity (onChange event).
 */

interface SortSelectorProps {
  currentSort?: string;
}

export function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('sortBy', value);
    } else {
      params.delete('sortBy');
    }
    params.set('page', '1'); // Reset to page 1 when sorting changes
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sort by:
      </label>
      <select
        id="sort"
        className="text-sm border-gray-300 rounded-md"
        value={currentSort || ''}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
        <option value="newest">Newest First</option>
        <option value="rating">Highest Rated</option>
      </select>
    </div>
  );
}
