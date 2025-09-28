import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FavoritesProvider, useFavorites } from '@/context/FavoritesContext';
import '@testing-library/jest-dom';

// Mock the localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

function Consumer() {
  const { favorites, isFavorite, add, addMany, remove, clear } = useFavorites();
  return (
    <div>
      <div data-testid="count">{Object.keys(favorites).length}</div>
      <div data-testid="is-1">{String(isFavorite(1))}</div>
      <button onClick={() => add({ id: 1, name: 'Rick', image: 'rick.png' })}>add1</button>
      <button
        onClick={() =>
          addMany([
            { id: 2, name: 'Morty', image: 'morty.png' },
            { id: 3, name: 'Summer', image: 'summer.png' },
          ])
        }
      >
        addMany
      </button>
      <button onClick={() => remove(2)}>remove2</button>
      <button onClick={() => clear()}>clear</button>
    </div>
  );
}

describe('FavoritesContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('adds, removes, and clears favorites and persists to localStorage', () => {
    render(
      <FavoritesProvider>
        <Consumer />
      </FavoritesProvider>
    );

    const count = () => Number(screen.getByTestId('count').textContent);
    const is1 = () => screen.getByTestId('is-1').textContent;

    expect(count()).toBe(0);
    expect(is1()).toBe('false');

    fireEvent.click(screen.getByText('add1'));
    expect(count()).toBe(1);
    expect(is1()).toBe('true');

    fireEvent.click(screen.getByText('addMany'));
    expect(count()).toBe(3);

    // persisted
    const raw = window.localStorage.getItem('favorites:v1');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(String(raw));
    expect(parsed[1].name).toBe('Rick');

    fireEvent.click(screen.getByText('remove2'));
    expect(count()).toBe(2);

    fireEvent.click(screen.getByText('clear'));
    expect(count()).toBe(0);
  });

  it('loads from localStorage on mount', () => {
    window.localStorage.setItem(
      'favorites:v1',
      JSON.stringify({ 1: { id: 1, name: 'Rick', image: 'rick.png' } })
    );

    render(
      <FavoritesProvider>
        <Consumer />
      </FavoritesProvider>
    );

    expect(Number(screen.getByTestId('count').textContent)).toBe(1);
    expect(screen.getByTestId('is-1').textContent).toBe('true');
  });
});
