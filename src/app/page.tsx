'use client';

import { useState, useCallback, useEffect } from 'react';
import CharacterGrid from '@/components/characters/CharacterGrid';
import CharacterTable from '@/components/characters/CharacterTable';
import CharacterFilters from '@/components/characters/CharacterFilters';
import PaginationControls from '@/components/characters/PaginationControls';
import ViewToggle from '@/components/layout/ViewToggle';
import type { CharacterFilters as CharacterFiltersType } from '@/schemas/characterFilters';
import { useCharacterData } from '@/hooks/useCharacterData';
import { usePagination } from '@/hooks/usePagination';
import { useBulkActions } from '@/hooks/useBulkActions';
import { useView } from '@/context/ViewContext';

// Constants
const MIN_SEARCH_LENGTH = 2;

export default function Home() {
  // State for filters with proper typing
  const [filters, setFilters] = useState<CharacterFiltersType>({
    name: '',
    status: '',
    sort: 'none',
  });

  // Pagination hook
  const { page, pageSize, infinite, setPageSize, setInfinite, handlePageChange, resetPage } =
    usePagination();

  // Character data hook
  const { buffer, displayItems, loading, error, pages, canSearch, hasMore, load, loadMore } =
    useCharacterData({ filters, page, pageSize, infinite });

  // Bulk actions hook
  const { selectedCount, handleAddToFavorites } = useBulkActions({ characters: buffer });

  // View mode hook
  const { viewMode } = useView();

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: CharacterFiltersType) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset page when filters change
  useEffect(() => {
    resetPage();
  }, [filters.name, filters.status, infinite, resetPage]);

  return (
    <div className="space-y-6">
      <CharacterFilters value={filters} onChange={handleFilterChange} />

      {!canSearch && filters.name.length > 0 && (
        <p className="text-sm text-black/70 dark:text-white/70">
          Type at least {MIN_SEARCH_LENGTH} characters to search.
        </p>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <ViewToggle />

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Page size:</label>
              <select
                className="rounded border px-2 py-1 bg-transparent min-w-[70px]"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                disabled={infinite}
                title={infinite ? 'Disable infinite mode to change page size' : 'Page size'}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={infinite}
                onChange={e => setInfinite(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Infinite scroll</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToFavorites}
            disabled={selectedCount === 0}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Add to Favorites ({selectedCount})
          </button>
        </div>
      </div>

      {/* Character Display */}
      {viewMode === 'grid' ? (
        <CharacterGrid items={displayItems} loading={loading} error={error} onRetry={load} />
      ) : (
        <CharacterTable items={displayItems} loading={loading} error={error} onRetry={load} />
      )}

      {/* Load More Button for Infinite Scroll */}
      {infinite && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControls
        page={page}
        pages={pages}
        pageSize={pageSize}
        infinite={infinite}
        loading={loading}
        onPageChange={newPage => handlePageChange(newPage, pages)}
        onPageSizeChange={setPageSize}
        onToggleInfinite={setInfinite}
        className="mt-6"
      />
    </div>
  );
}
