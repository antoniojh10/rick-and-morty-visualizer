import React from 'react';
import { Character } from '@/types/character';
import { useFavorites } from '@/context/FavoritesContext';
import { useSelection } from '@/context/SelectionContext';
import { useNotify } from '@/context/NotificationContext';

interface FavoriteActionsProps {
  selected: Record<number, boolean>;
  items: Character[];
  onClearSelection: () => void;
}

export function FavoriteActions({ selected, items, onClearSelection }: FavoriteActionsProps) {
  const { addMany } = useFavorites();
  const { clear: clearSelection } = useSelection();
  const { addToast } = useNotify();

  const handleAddToFavorites = () => {
    const selectedIds = Object.entries(selected)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => Number(id));

    if (selectedIds.length === 0) {
      addToast({ type: 'info', message: 'No characters selected' });
      return;
    }

    const selectedCharacters = items.filter(c => selectedIds.includes(c.id));
    addMany(
      selectedCharacters.map(c => ({
        id: c.id,
        name: c.name,
        image: c.image,
      }))
    );

    clearSelection();
    onClearSelection();

    addToast({
      type: 'success',
      message: `Added ${selectedCharacters.length} character(s) to favorites`,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-1 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={handleAddToFavorites}
      >
        Add Selected to Favorites
      </button>
      <button
        className="px-3 py-1 border rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => {
          clearSelection();
          onClearSelection();
        }}
      >
        Clear Selection
      </button>
    </div>
  );
}

export default FavoriteActions;
