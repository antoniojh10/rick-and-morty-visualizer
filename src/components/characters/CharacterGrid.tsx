'use client';

import type { Character } from '@/types/character';
import CharacterCard from './CharacterCard';

export default function CharacterGrid({
  items,
  loading,
  error,
  onRetry,
}: {
  items: Character[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="mb-3">{error}</p>
        {onRetry && (
          <button className="rounded border px-3 py-1 text-sm" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-60 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return <p className="text-center py-10">No characters found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map(c => (
        <CharacterCard key={c.id} c={c} />
      ))}
    </div>
  );
}
