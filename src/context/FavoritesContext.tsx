'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface FavoriteItem {
  id: number;
  name: string;
  image: string;
}

interface FavoritesContextValue {
  favorites: Record<number, FavoriteItem>;
  isFavorite: (id: number) => boolean;
  add: (item: FavoriteItem) => void;
  addMany: (items: FavoriteItem[]) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_KEY = 'favorites:v1';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<number, FavoriteItem>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = useCallback((id: number) => !!favorites[id], [favorites]);

  const add = useCallback((item: FavoriteItem) => {
    setFavorites(prev => ({ ...prev, [item.id]: item }));
  }, []);

  const addMany = useCallback((items: FavoriteItem[]) => {
    setFavorites(prev => {
      const next = { ...prev } as Record<number, FavoriteItem>;
      for (const it of items) next[it.id] = it;
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setFavorites(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setFavorites({}), []);

  const value = useMemo(
    () => ({ favorites, isFavorite, add, addMany, remove, clear }),
    [favorites, isFavorite, add, addMany, remove, clear]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
