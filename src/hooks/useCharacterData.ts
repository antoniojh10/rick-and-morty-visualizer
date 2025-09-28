import { useState, useCallback, useEffect, useMemo } from 'react';
import { fetchCharacters } from '@/services/api';
import type { Character, Status } from '@/types/character';
import type { CharacterFilters } from '@/schemas/characterFilters';
import { useDebounce } from '@/hooks/useDebounce';

// Constants
const API_PAGE_SIZE = 20;
const MIN_SEARCH_LENGTH = 2;

interface UseCharacterDataProps {
  filters: CharacterFilters;
  page: number;
  pageSize: number;
  infinite: boolean;
}

interface UseCharacterDataReturn {
  buffer: Character[];
  sortedBuffer: Character[];
  displayItems: Character[];
  loading: boolean;
  error: string | null;
  pages: number;
  totalApiPages: number;
  canSearch: boolean;
  hasMore: boolean;
  load: (force?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useCharacterData({ 
  filters, 
  page, 
  pageSize, 
  infinite 
}: UseCharacterDataProps): UseCharacterDataReturn {
  // Debounce the name filter
  const debouncedName = useDebounce(filters.name, 300);
  
  // Data state
  const [buffer, setBuffer] = useState<Character[]>([]);
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set());
  const [totalApiPages, setTotalApiPages] = useState<number>(1);
  const [pages, setPages] = useState(1);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized filters
  const debouncedFilters = useMemo(() => ({
    name: debouncedName ?? "",
    status: filters.status,
    sort: filters.sort
  }), [debouncedName, filters.status, filters.sort]);

  const { name, status, sort = "none" } = debouncedFilters;
  const canSearch = !name || name.trim().length >= MIN_SEARCH_LENGTH;
  
  // Calculate if there are more pages to load in infinite mode
  const hasMore = infinite && fetchedPages.size < totalApiPages;

  // Sort characters based on the selected sort option
  const sortedBuffer = useMemo(() => {
    if (sort === "none") return buffer;
    const arr = [...buffer];
    arr.sort((a, b) => 
      sort === "az" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    return arr;
  }, [buffer, sort]);

  // Get items to display: in infinite mode we show the whole buffer; in paged mode we slice by page/pageSize
  const displayItems = useMemo(() => {
    if (infinite) {
      return sortedBuffer;
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedBuffer.slice(start, end);
  }, [sortedBuffer, infinite, page, pageSize]);

  // Fetch a specific API page and append to buffer
  const fetchApiPage = useCallback(async (p: number): Promise<number> => {
    if (fetchedPages.has(p)) {
      return totalApiPages;
    }
    
    try {
      const data = await fetchCharacters({ 
        page: p, 
        name: name.trim(), 
        status: status as Status | undefined 
      });
      
      if (!data || !data.results) {
        throw new Error('Invalid API response');
      }
      
      const apiTotal = data.info?.pages ?? 1;
      
      setTotalApiPages(apiTotal);
      setBuffer(prev => {
        const map = new Map(prev.map(c => [c.id, c]));
        data.results?.forEach(c => map.set(c.id, c));
        return Array.from(map.values());
      });
      
      setFetchedPages(prev => new Set(prev).add(p));
      
      return apiTotal;
    } catch (error) {
      console.error(`Failed to fetch page ${p}:`, error);
      throw error;
    }
  }, [name, status, fetchedPages, totalApiPages]);

  // Get the specific API page needed for the current view
  const ensurePagedSlice = useCallback(async () => {
    if (!canSearch) return;
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    // Calculate which API page we need to fetch
    const firstItemInPage = start + 1;
    const lastItemInPage = end;
    const firstNeededApiPage = Math.ceil(firstItemInPage / API_PAGE_SIZE);
    const lastNeededApiPage = Math.ceil(lastItemInPage / API_PAGE_SIZE);
    
    // Fetch only the required API pages
    const apiPagesToFetch = [];
    for (let p = firstNeededApiPage; p <= lastNeededApiPage; p++) {
      if (!fetchedPages.has(p)) {
        apiPagesToFetch.push(p);
      }
    }
    
    // Fetch all required pages in parallel
    if (apiPagesToFetch.length > 0) {
      const results = await Promise.allSettled(
        apiPagesToFetch.map(p => fetchApiPage(p))
      );
      
      // Check for any errors
      const errors = results.filter(r => r.status === 'rejected');
      if (errors.length > 0) {
        console.error('Some pages failed to load:', errors);
      }
      
      // Update total pages based on the first successful response
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const apiTotal = result.value;
          const approxTotal = apiTotal * API_PAGE_SIZE;
          const calculatedPages = Math.max(1, Math.ceil(approxTotal / pageSize));
          setPages(calculatedPages);
          break;
        }
      }
    }
  }, [canSearch, page, pageSize, fetchApiPage, fetchedPages]);

  // Load data based on current state
  const load = useCallback(async (force = false) => {
    if (!canSearch) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (infinite) {
        if (fetchedPages.size === 0) {
          await fetchApiPage(1);
        }
      } else {
        await ensurePagedSlice();
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to load characters");
      setBuffer([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [canSearch, infinite, fetchedPages.size, fetchApiPage, ensurePagedSlice]);

  // Load more data for infinite scroll
  const loadMore = useCallback(async () => {
    if (!canSearch || !hasMore || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const nextPage = fetchedPages.size + 1;
      await fetchApiPage(nextPage);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load more characters");
    } finally {
      setLoading(false);
    }
  }, [canSearch, hasMore, loading, fetchedPages.size, fetchApiPage]);

  // Reset state when search criteria change
  useEffect(() => {
    setBuffer([]);
    setFetchedPages(new Set());
    setTotalApiPages(1);
  }, [name, status, infinite]);

  // Memoize the current search key to prevent unnecessary effect runs
  const searchKey = useMemo(
    () => `${name}-${status}-${page}-${pageSize}-${infinite}`,
    [name, status, page, pageSize, infinite]
  );

  // Effect to load data when search key changes
  useEffect(() => {
    if (!canSearch) return;
    
    const fetchData = async () => {
      if (infinite) {
        if (fetchedPages.size === 0) {
          await load();
        }
      } else {
        await load();
      }
    };

    fetchData();
  }, [searchKey, canSearch, infinite, fetchedPages.size, load]);

  return {
    buffer,
    sortedBuffer,
    displayItems,
    loading,
    error,
    pages,
    totalApiPages,
    canSearch,
    hasMore,
    load,
    loadMore,
  };
}
