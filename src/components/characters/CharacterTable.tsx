'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { Character } from '@/types/character';
import { useSelection } from '@/context/SelectionContext';

interface CharacterTableProps {
  items: Character[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type SortField = 'name' | 'status' | 'species' | 'location';
type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export default function CharacterTable({ items, loading, error, onRetry }: CharacterTableProps) {
  const router = useRouter();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'name', direction: null });
  const { selected, toggle, toggleAll } = useSelection();

  const sortedItems = useMemo(() => {
    if (!sortConfig.direction) return items;

    return [...items].sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortConfig.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'species':
          aValue = a.species;
          bValue = b.species;
          break;
        case 'location':
          aValue = a.location.name;
          bValue = b.location.name;
          break;
        default:
          return 0;
      }

      const result = aValue.localeCompare(bValue);
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [items, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        // Cycle through: null -> asc -> desc -> null
        const newDirection: SortDirection = 
          prev.direction === null ? 'asc' :
          prev.direction === 'asc' ? 'desc' : null;
        return { field, direction: newDirection };
      }
      return { field, direction: 'asc' };
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field || sortConfig.direction === null) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="w-4 h-4 text-blue-500" />;
  };

  const allSelected = items.length > 0 && items.every(item => selected[item.id]);
  const someSelected = items.some(item => selected[item.id]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-foreground/20 bg-background">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-foreground/5 border-b border-foreground/10">
            <th className="border-r border-foreground/10 p-3 text-left text-foreground">
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = someSelected && !allSelected;
                }}
                onChange={() => toggleAll(items.map(item => item.id))}
                className="rounded"
                aria-label="Select all characters"
              />
            </th>
            <th className="border-r border-foreground/10 p-3 text-left w-20 text-foreground font-medium">
              Image
            </th>
            <th 
              className="border-r border-foreground/10 p-3 text-left cursor-pointer hover:bg-foreground/5 text-foreground font-medium"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                Name
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              className="border-r border-foreground/10 p-3 text-left cursor-pointer hover:bg-foreground/5 text-foreground font-medium"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-2">
                Status
                {getSortIcon('status')}
              </div>
            </th>
            <th 
              className="border-r border-foreground/10 p-3 text-left cursor-pointer hover:bg-foreground/5 text-foreground font-medium"
              onClick={() => handleSort('species')}
            >
              <div className="flex items-center gap-2">
                Species
                {getSortIcon('species')}
              </div>
            </th>
            <th 
              className="p-3 text-left cursor-pointer hover:bg-foreground/5 text-foreground font-medium"
              onClick={() => handleSort('location')}
            >
              <div className="flex items-center gap-2">
                Location
                {getSortIcon('location')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="border border-gray-300 dark:border-gray-600 p-8 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Loading characters...
                </div>
              </td>
            </tr>
          ) : sortedItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="border border-gray-300 dark:border-gray-600 p-8 text-center text-gray-600 dark:text-gray-400">
                No characters found
              </td>
            </tr>
          ) : (
            sortedItems.map((character) => (
              <tr 
                key={character.id} 
                className={`hover:bg-foreground/5 cursor-pointer border-b border-foreground/10 ${
                  selected[character.id] ? 'bg-accent/10' : ''
                }`}
                onClick={() => router.push(`/character/${character.id}`)}
              >
                <td className="border-r border-foreground/10 p-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selected[character.id] || false}
                    onChange={() => toggle(character.id)}
                    className="rounded"
                    aria-label={`Select ${character.name}`}
                  />
                </td>
                <td className="border-r border-foreground/10 p-3">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                </td>
                <td className="border-r border-foreground/10 p-3 font-medium text-foreground">
                  {character.name}
                </td>
                <td className="border-r border-foreground/10 p-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    character.status === 'Alive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    character.status === 'Dead' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {character.status}
                  </span>
                </td>
                <td className="border-r border-foreground/10 p-3 text-foreground">
                  {character.species}
                </td>
                <td className="p-3 text-foreground">
                  {character.location.name}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
