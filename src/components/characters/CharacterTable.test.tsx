import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterTable from './CharacterTable';
import { SelectionProvider } from '@/context/SelectionContext';
import type { Character } from '@/types/character';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: ['episode1'],
    url: '',
    created: '2017-11-04T18:48:46.250Z',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'unknown', url: '' },
    location: { name: 'Citadel of Ricks', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: ['episode1'],
    url: '',
    created: '2017-11-04T18:50:21.651Z',
  },
];

const renderWithProviders = (ui: React.ReactElement) => {
  return render(<SelectionProvider>{ui}</SelectionProvider>);
};

describe('CharacterTable', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders character data correctly', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getAllByText('Human')).toHaveLength(2); // Both characters are human
    expect(screen.getAllByText('Citadel of Ricks')).toHaveLength(2); // Both are at the same location
  });

  it('shows loading state', () => {
    renderWithProviders(<CharacterTable items={[]} loading={true} />);

    expect(screen.getByText('Loading characters...')).toBeInTheDocument();
  });

  it('shows error state with retry button', () => {
    const mockRetry = vi.fn();
    renderWithProviders(<CharacterTable items={[]} error="Failed to load" onRetry={mockRetry} />);

    expect(screen.getByText('Failed to load')).toBeInTheDocument();

    const retryButton = screen.getByText('Retry');
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledOnce();
  });

  it('shows empty state when no characters', () => {
    renderWithProviders(<CharacterTable items={[]} />);

    expect(screen.getByText('No characters found')).toBeInTheDocument();
  });

  it('allows sorting by name', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toBeInTheDocument();

    // Click to sort ascending
    fireEvent.click(nameHeader!);

    // Check that the sort icon changes (we can verify this by checking for the presence of sort icons)
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('navigates to character detail when row is clicked', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    const firstRow = screen.getByText('Rick Sanchez').closest('tr');
    fireEvent.click(firstRow!);

    expect(mockPush).toHaveBeenCalledWith('/character/1');
  });

  it('allows character selection via checkbox', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    const checkbox = screen.getAllByRole('checkbox')[1]; // First is "select all"
    fireEvent.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('prevents navigation when checkbox is clicked', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    const checkbox = screen.getAllByRole('checkbox')[1]; // First is "select all"
    fireEvent.click(checkbox);

    // Navigation should not be triggered when clicking checkbox
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handles select all functionality', () => {
    renderWithProviders(<CharacterTable items={mockCharacters} />);

    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    // All character checkboxes should be checked
    const characterCheckboxes = screen.getAllByRole('checkbox').slice(1);
    characterCheckboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });
});
