import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import CharacterCard from '@/components/characters/CharacterCard';
import * as SelectionContext from '@/context/SelectionContext';
import * as FavoritesContext from '@/context/FavoritesContext';
import type { Character, Status } from '@/types/character';

// Mock the SelectionContext
vi.mock('@/context/SelectionContext', async importOriginal => {
  const actual = await importOriginal<typeof import('@/context/SelectionContext')>();
  return {
    ...actual,
    useSelection: vi.fn(),
  };
});

// Mock the FavoritesContext
vi.mock('@/context/FavoritesContext', async importOriginal => {
  const actual = await importOriginal<typeof import('@/context/FavoritesContext')>();
  return {
    ...actual,
    useFavorites: vi.fn(),
  };
});

// Type for the mock implementations
const mockUseSelection = vi.mocked(SelectionContext.useSelection);
const mockUseFavorites = vi.mocked(FavoritesContext.useFavorites);

const sample: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive' as Status,
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://via.placeholder.com/150',
  episode: [],
  url: '',
  created: '',
};

describe('CharacterCard', () => {
  const toggleMock = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Default mock implementations
    mockUseSelection.mockReturnValue({
      selected: {},
      isSelected: vi.fn().mockReturnValue(false),
      toggle: toggleMock,
      toggleAll: vi.fn(),
      selectMany: vi.fn(),
      deselectMany: vi.fn(),
      clear: vi.fn(),
    });

    mockUseFavorites.mockReturnValue({
      favorites: {},
      add: vi.fn(),
      addMany: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
    });
  });

  it('renders character information correctly', () => {
    renderWithProviders(<CharacterCard c={sample} />);

    expect(screen.getByText(/rick sanchez/i)).toBeInTheDocument();
    expect(screen.getByText(/human/i)).toBeInTheDocument();
    expect(screen.getByText(/citadel of ricks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select/i })).toBeInTheDocument();
  });

  it('calls toggle when select button is clicked', () => {
    renderWithProviders(<CharacterCard c={sample} />);

    const selectButton = screen.getByRole('button', { name: /select/i });
    fireEvent.click(selectButton);

    expect(toggleMock).toHaveBeenCalledWith(sample.id);
  });

  it('shows unselect button when character is selected', () => {
    // Mock the selection context to show the character as selected
    mockUseSelection.mockReturnValue({
      selected: { [sample.id]: true },
      isSelected: vi.fn(id => id === sample.id),
      toggle: toggleMock,
      toggleAll: vi.fn(),
      selectMany: vi.fn(),
      deselectMany: vi.fn(),
      clear: vi.fn(),
    });

    mockUseFavorites.mockReturnValue({
      favorites: {},
      add: vi.fn(),
      addMany: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      isFavorite: vi.fn().mockReturnValue(false),
    });

    renderWithProviders(<CharacterCard c={sample} />);

    // Should show the unselect button
    const unselectButton = screen.getByRole('button', { name: /unselect/i });
    expect(unselectButton).toBeInTheDocument();
    expect(unselectButton).toHaveTextContent('Unselect');

    // Should not show the select button (use exact match to avoid matching "Unselect")
    expect(screen.queryByRole('button', { name: /^select$/i })).not.toBeInTheDocument();
  });
});
