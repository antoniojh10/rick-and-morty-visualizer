import { useCallback } from 'react';
import type { Character } from '@/types/character';
import { useSelection } from '@/context/SelectionContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useNotify } from '@/context/NotificationContext';

interface UseBulkActionsProps {
  characters: Character[];
}

interface UseBulkActionsReturn {
  selectedCount: number;
  handleAddToFavorites: () => void;
}

export function useBulkActions({ characters }: UseBulkActionsProps): UseBulkActionsReturn {
  const { selected, clear: clearSelection } = useSelection();
  const { addMany } = useFavorites();
  const { addToast } = useNotify();

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleAddToFavorites = useCallback(() => {
    const selectedChars = characters.filter(char => selected[char.id]);

    if (selectedChars.length === 0) {
      addToast({ type: 'info', message: 'No characters selected' });
      return;
    }

    addMany(selectedChars);
    clearSelection();
    addToast({
      type: 'success',
      message: `Added ${selectedChars.length} character${selectedChars.length > 1 ? 's' : ''} to favorites`,
    });
  }, [characters, selected, addMany, clearSelection, addToast]);

  return {
    selectedCount,
    handleAddToFavorites,
  };
}
