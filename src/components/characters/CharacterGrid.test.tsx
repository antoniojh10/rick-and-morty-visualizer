import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import CharacterGrid from '@/components/characters/CharacterGrid';

describe('CharacterGrid', () => {
  it('renders loading skeletons', () => {
    renderWithProviders(<CharacterGrid items={[]} loading />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders error with retry', async () => {
    const onRetry = vi.fn();
    renderWithProviders(<CharacterGrid items={[]} error="Boom" onRetry={onRetry} />);
    expect(screen.getByText(/boom/i)).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /retry/i });
    btn.click();
    expect(onRetry).toHaveBeenCalled();
  });

  it('renders empty state', () => {
    renderWithProviders(<CharacterGrid items={[]} />);
    expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
  });
});
