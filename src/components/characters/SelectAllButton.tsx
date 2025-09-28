'use client';

import { useSelection } from '@/context/SelectionContext';
import type { Character } from '@/types/character';

interface SelectAllButtonProps {
  items: Character[];
  className?: string;
}

export function SelectAllButton({ items, className = '' }: SelectAllButtonProps) {
  const { selected, toggleAll } = useSelection();

  const itemIds = items.map(item => item.id);
  const selectedCount = itemIds.filter(id => selected[id]).length;
  const isAllSelected = itemIds.length > 0 && selectedCount === itemIds.length;

  const handleToggleAll = () => {
    toggleAll(itemIds);
  };

  if (itemIds.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={handleToggleAll}
        className="px-4 py-2 text-sm font-medium rounded-lg border transition-colors hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
        aria-label={`${isAllSelected ? 'Deselect' : 'Select'} all ${itemIds.length} characters`}
      >
        {isAllSelected ? 'Deselect All' : 'Select All'}
      </button>

      {selectedCount > 0 && (
        <span className="text-sm text-foreground/70">
          {selectedCount} of {itemIds.length} selected
        </span>
      )}
    </div>
  );
}
