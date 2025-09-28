import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import Home from '@/app/page';

vi.mock('@/services/api', () => ({
  fetchCharacters: vi.fn(async ({ page = 1 }: { page?: number } = {}) => ({
    info: { count: 60, pages: 3, next: null, prev: null },
    results: Array.from({ length: 20 }, (_, i) => ({
      id: (page - 1) * 20 + i + 1,
      name: `Char ${i}`,
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: `https://rickandmortyapi.com/api/character/avatar/${(page - 1) * 20 + i + 1}.jpeg`,
      episode: [],
      url: '',
      created: '',
    })),
  })),
}));

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows pagination in paged mode when multiple pages exist', async () => {
    await act(async () => {
      renderWithProviders(<Home />);
    });

    // Wait for async state updates to complete
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });

    expect(screen.getByText(/page 1 /i)).toBeInTheDocument();
  });

  it('enables infinite mode and shows Load More button', async () => {
    await act(async () => {
      renderWithProviders(<Home />);
    });

    // Wait for initial load
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });

    // Initially should show pagination
    expect(screen.getByText(/page 1 /i)).toBeInTheDocument();

    // Enable infinite scroll
    const checkbox = screen.getByLabelText(/infinite scroll/i);
    await act(async () => {
      fireEvent.click(checkbox);
    });

    // Wait for state updates after checkbox click
    await act(async () => {
      await new Promise(r => setTimeout(r, 0));
    });

    // Pagination should be hidden in infinite mode
    expect(screen.queryByText(/page 1 /i)).not.toBeInTheDocument();

    // Load More button should be visible
    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });
});
