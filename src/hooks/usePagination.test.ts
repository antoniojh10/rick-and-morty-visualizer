import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

describe('usePagination', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(20);
    expect(result.current.infinite).toBe(false);
  });

  it('initializes with custom values', () => {
    const { result } = renderHook(() =>
      usePagination({
        initialPage: 3,
        initialPageSize: 50,
        initialInfinite: true,
      })
    );

    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(50);
    expect(result.current.infinite).toBe(true);
  });

  it('updates page size', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setPageSize(10);
    });

    expect(result.current.pageSize).toBe(10);
  });

  it('updates infinite mode', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.setInfinite(true);
    });

    expect(result.current.infinite).toBe(true);
  });

  it('handles page change within bounds', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.handlePageChange(3, 5);
    });

    expect(result.current.page).toBe(3);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('ignores page change outside bounds', () => {
    const { result } = renderHook(() => usePagination());

    act(() => {
      result.current.handlePageChange(0, 5); // Below minimum
    });

    expect(result.current.page).toBe(1); // Should remain unchanged

    act(() => {
      result.current.handlePageChange(10, 5); // Above maximum
    });

    expect(result.current.page).toBe(1); // Should remain unchanged
  });

  it('resets page to 1', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5 }));

    expect(result.current.page).toBe(5);

    act(() => {
      result.current.resetPage();
    });

    expect(result.current.page).toBe(1);
  });
});
