"use client";

import { useEffect, useMemo, useState } from "react";
import CharacterFilters, { type FiltersState } from "@/components/characters/CharacterFilters";
import CharacterTable from "@/components/table/CharacterTable";
import { fetchCharacters } from "@/services/api";
import type { Character } from "@/types/character";

export default function TablePage() {
  const [filters, setFilters] = useState<FiltersState>({ name: "", status: "", sort: "az" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Character[]>([]);

  const canSearch = filters.name.trim().length === 0 || filters.name.trim().length >= 2;

  // Fetch multiple API pages to enable client-side pagination
  async function loadAll() {
    if (!canSearch) return;
    setLoading(true);
    setError(null);
    try {
      const collected: Character[] = [];
      let page = 1;
      let totalPages = 1;
      const MAX_PAGES = 5; // cap to avoid excessive requests
      do {
        const data = await fetchCharacters({ page, name: filters.name.trim(), status: filters.status });
        collected.push(...(data.results ?? []));
        totalPages = data.info?.pages ?? 1;
        page += 1;
      } while (page <= totalPages && page <= MAX_PAGES);
      setItems(collected);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load characters");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.name, filters.status]);

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => (filters.sort === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    return arr;
  }, [items, filters.sort]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Characters Table</h1>
      <CharacterFilters value={filters} onChange={setFilters} />

      {!canSearch && (
        <p className="text-sm text-black/70 dark:text-white/70">Type at least 2 characters to search.</p>
      )}

      {error ? (
        <div className="text-center py-10 space-y-3">
          <p>{error}</p>
          <button className="rounded border px-3 py-1 text-sm" onClick={loadAll}>Retry</button>
        </div>
      ) : loading ? (
        <div className="py-10 text-center">Loading…</div>
      ) : (
        <CharacterTable items={sorted} />
      )}
    </div>
  );
}
