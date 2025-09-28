'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Character } from '@/types/character';
import { useSelection } from '@/context/SelectionContext';
import { useFavorites } from '@/context/FavoritesContext';

export default function CharacterCard({ c }: { c: Character }) {
  const { isSelected, toggle } = useSelection();
  const { isFavorite, remove } = useFavorites();
  const selected = isSelected(c.id);
  const isFavorited = isFavorite(c.id);
  return (
    <Link
      href={`/character/${c.id}`}
      className={`group overflow-hidden rounded-lg border hover:shadow transition ${
        selected ? 'border-2 border-accent ring-2 ring-accent/30' : 'border-foreground/15'
      }`}
      aria-selected={selected}
    >
      <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/10">
        <Image
          src={c.image}
          alt={c.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold truncate" title={c.name}>
            {c.name}
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              c.status === 'Alive'
                ? 'border-green-600 text-green-600'
                : c.status === 'Dead'
                  ? 'border-red-600 text-red-600'
                  : 'border-gray-500 text-gray-500'
            }`}
          >
            {c.status}
          </span>
        </div>
        <p className="text-sm text-foreground/70">{c.species}</p>
        <p className="text-xs text-foreground/60">Location: {c.location?.name}</p>
        <div className="pt-1 flex justify-end">
          {isFavorited ? (
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                remove(c.id);
              }}
              className="rounded px-3 py-1 text-xs transition border border-red-500 text-red-500 hover:bg-red-500/10"
              aria-label="Remove from favorites"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                toggle(c.id);
              }}
              className={`rounded px-3 py-1 text-xs transition border ${
                selected
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'border-foreground/20 hover:bg-foreground/5'
              }`}
              aria-pressed={selected}
            >
              {selected ? 'Unselect' : 'Select'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
