import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SelectAllButton } from './SelectAllButton';
import { SelectionProvider } from '@/context/SelectionContext';
import type { Character } from '@/types/character';

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [],
    url: '',
    created: '',
  },
  {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    episode: [],
    url: '',
    created: '',
  },
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<SelectionProvider>{ui}</SelectionProvider>);
};

describe('SelectAllButton', () => {
  it('renders with correct initial state', () => {
    renderWithProvider(<SelectAllButton items={mockCharacters} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Select All');
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('does not render when no items', () => {
    renderWithProvider(<SelectAllButton items={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows correct text when all items are selected', () => {
    renderWithProvider(<SelectAllButton items={mockCharacters} />);

    // Click to select all
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // The button should show "Deselect All" and show count
    expect(button).toHaveTextContent('Deselect All');
    expect(screen.getByText('2 of 2 selected')).toBeInTheDocument();
  });

  it('toggles all items when clicked', () => {
    renderWithProvider(<SelectAllButton items={mockCharacters} />);

    const button = screen.getByRole('button');

    // Click to select all
    fireEvent.click(button);
    expect(button).toHaveTextContent('Deselect All');
    expect(screen.getByText('2 of 2 selected')).toBeInTheDocument();

    // Click to deselect all
    fireEvent.click(button);
    expect(button).toHaveTextContent('Select All');
    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    renderWithProvider(<SelectAllButton items={mockCharacters} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Select all 2 characters');
  });
});
