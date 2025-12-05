'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PaginationMeta } from '@/lib/types/api';

/**
 * Pagination Component (Client Component)
 *
 * Displays pagination controls (Previous, page numbers, Next).
 * This is a Client Component because it handles click events and navigation.
 *
 * Educational Note: Pagination improves performance by limiting results per page
 * and improves UX by making large datasets navigable.
 *
 * Props:
 * - pagination: Metadata about current page, total pages, etc.
 */

interface PaginationProps {
  pagination: PaginationMeta;
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { page, totalPages, hasNext, hasPrev } = pagination;

  // Navigate to a specific page
  // Educational: Updates URL parameter, triggers Server Component re-render
  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  // Calculate which page numbers to show
  // Educational: We don't show all page numbers if there are many pages
  // Instead, we show a "window" around the current page
  const getPageNumbers = (): number[] => {
    const windowSize = 5;
    const pages: number[] = [];

    if (totalPages <= windowSize) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show window around current page
      const halfWindow = Math.floor(windowSize / 2);
      let startPage = Math.max(1, page - halfWindow);
      let endPage = Math.min(totalPages, page + halfWindow);

      // Adjust if we're near the start
      if (page <= halfWindow) {
        endPage = Math.min(windowSize, totalPages);
      }

      // Adjust if we're near the end
      if (page >= totalPages - halfWindow) {
        startPage = Math.max(1, totalPages - windowSize + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-8"
      aria-label="Pagination"
    >
      {/* Mobile: Simple Previous/Next */}
      <div className="flex w-0 flex-1 sm:hidden">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={!hasPrev}
          className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
            hasPrev
              ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
      </div>

      {/* Desktop: Page numbers */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Previous button */}
        <div className="-mt-px flex w-0 flex-1">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={!hasPrev}
            className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium ${
              hasPrev
                ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>
        </div>

        {/* Page numbers */}
        <div className="hidden md:-mt-px md:flex">
          {/* Show first page if not in window */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
            </>
          )}

          {/* Page number buttons */}
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                pageNum === page
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          ))}

          {/* Show last page if not in window */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
                  ...
                </span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next button */}
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            onClick={() => goToPage(page + 1)}
            disabled={!hasNext}
            className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
              hasNext
                ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                : 'text-gray-300 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Mobile: Next */}
      <div className="flex w-0 flex-1 justify-end sm:hidden">
        <button
          onClick={() => goToPage(page + 1)}
          disabled={!hasNext}
          className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium ${
            hasNext
              ? 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}

/**
 * Educational Notes:
 *
 * 1. Pagination Patterns:
 *    - Previous/Next for navigation
 *    - Page numbers for direct access
 *    - Current page highlighted
 *    - Ellipsis (...) for skipped pages
 *
 * 2. Page Number Window:
 *    - Don't show all pages (could be hundreds!)
 *    - Show window around current page
 *    - Always show first and last page
 *    - Use "..." to indicate skipped pages
 *
 * 3. Responsive Design:
 *    - Mobile: Just Previous/Next
 *    - Desktop: Full page numbers
 *    - Different layouts for different screen sizes
 *
 * 4. Disabled State:
 *    - Disable Previous on first page
 *    - Disable Next on last page
 *    - Visual indication (gray, no hover)
 *    - cursor-not-allowed
 *
 * 5. Accessibility:
 *    - <nav> semantic element
 *    - aria-label for screen readers
 *    - aria-current for current page
 *    - Keyboard accessible (buttons)
 *
 * 6. URL-based Navigation:
 *    - Page number in URL (?page=2)
 *    - Bookmarkable
 *    - Browser back/forward works
 *    - SEO-friendly
 */
