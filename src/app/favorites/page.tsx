'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFavorites } from '@/context/FavoritesContext';
import { useNotify } from '@/context/NotificationContext';

export default function FavoritesPage() {
  const { favorites, remove, clear } = useFavorites();
  const { addToast } = useNotify();
  const items = Object.values(favorites);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My favorites</h1>
        {items.length > 0 && (
          <button
            className="rounded border px-3 py-1 text-sm"
            onClick={() => {
              clear();
              addToast({ type: 'success', message: 'Cleared all favorites' });
            }}
          >
            Clear all
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-black/70 dark:text-white/70">
          No favorites yet. Browse characters and add some!
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(it => (
            <div key={it.id} className="overflow-hidden rounded-lg border border-foreground/15">
              <Link href={`/characters/${it.id}`} className="block">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={it.image}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-3 flex items-center justify-between gap-2">
                <Link
                  href={`/characters/${it.id}`}
                  className="font-semibold truncate"
                  title={it.name}
                >
                  {it.name}
                </Link>
                <button
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() => {
                    remove(it.id);
                    addToast({ type: 'success', message: `Removed ${it.name}` });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
