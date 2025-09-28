import { useState, useCallback } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialPageSize?: number;
  initialInfinite?: boolean;
}

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  infinite: boolean;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setInfinite: (infinite: boolean) => void;
  handlePageChange: (newPage: number, maxPages: number) => void;
  resetPage: () => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 20,
  initialInfinite = false,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [infinite, setInfinite] = useState(initialInfinite);

  const handlePageChange = useCallback((newPage: number, maxPages: number) => {
    if (newPage < 1 || newPage > maxPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    infinite,
    setPage,
    setPageSize,
    setInfinite,
    handlePageChange,
    resetPage,
  };
}
