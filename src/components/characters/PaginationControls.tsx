import React from 'react';

interface PaginationControlsProps {
  page: number;
  pages: number;
  pageSize: number;
  infinite: boolean;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onToggleInfinite: (value: boolean) => void;
  className?: string;
}

export function PaginationControls({
  page,
  pages,
  pageSize,
  infinite,
  loading,
  onPageChange,
  onPageSizeChange,
  onToggleInfinite,
  className = ''
}: PaginationControlsProps) {

  return (
    <div className={`flex justify-center ${className}`}>
      {!infinite && pages > 1 && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1 || loading}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Previous page"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {pages}
          </span>
          
          <button
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page >= pages || loading}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginationControls;
