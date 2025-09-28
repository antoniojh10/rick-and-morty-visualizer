"use client";

import { useEffect, useMemo, useState } from "react";
import CharacterGrid from "@/components/characters/CharacterGrid";
import CharacterFilters, { type FiltersState } from "@/components/characters/CharacterFilters";
import { fetchCharacters } from "@/services/api";
import type { Character } from "@/types/character";

export default function Home() {
  const [filters, setFilters] = useState<FiltersState>({ name: "", status: "", sort: "az" });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSearch = filters.name.trim().length === 0 || filters.name.trim().length >= 2;

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => (filters.sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return arr;
  }, [items, filters.sort]);

  async function load() {
    if (!canSearch) return; // wait until min characters
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCharacters({ page, name: filters.name.trim(), status: filters.status });
      setItems(data.results ?? []);
      setPages(data.info?.pages ?? 1);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load characters");
      setItems([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }

  // Load on page/filters change
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.name, filters.status]);

  // Reset to page 1 when filters change (excluding sorting)
  useEffect(() => {
    setPage(1);
  }, [filters.name, filters.status]);

  return (
    <div className="space-y-6">
      <CharacterFilters value={filters} onChange={setFilters} />

      {!canSearch && (
        <p className="text-sm text-black/70 dark:text-white/70">Type at least 2 characters to search.</p>
      )}

      <CharacterGrid items={sorted} loading={loading} error={error} onRetry={load} />

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <span className="text-sm">Page {page} / {pages}</span>
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page >= pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
