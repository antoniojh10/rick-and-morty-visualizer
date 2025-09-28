"use client";

import { useMemo, useState } from "react";
import type { Character } from "@/types/character";
import { useFavorites } from "@/context/FavoritesContext";
import { useNotify } from "@/context/NotificationContext";

export type TableSortKey = "name" | "status" | "species";
export type TableSort = { key: TableSortKey; dir: "asc" | "desc" };

function Th({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return (
    <th className="p-2 cursor-pointer select-none" onClick={onClick}>
      <div className="inline-flex items-center gap-1">
        <span>{label}</span>
        {active && <span className="text-xs opacity-70">{dir === "asc" ? "▲" : "▼"}</span>}
      </div>
    </th>
  );
}

export default function CharacterTable({ items }: { items: Character[] }) {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sort, setSort] = useState<TableSort>({ key: "name", dir: "asc" });
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const { addMany } = useFavorites();
  const { addToast } = useNotify();

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a, b) => {
      const aVal = String((a as any)[sort.key] ?? "");
      const bVal = String((b as any)[sort.key] ?? "");
      const res = aVal.localeCompare(bVal);
      return sort.dir === "asc" ? res : -res;
    });
    return arr;
  }, [items, sort]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const allOnPageSelected = pageItems.length > 0 && pageItems.every((c) => selected[c.id]);

  function toggleSort(key: TableSortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function toggleAllOnPage() {
    setSelected((prev) => {
      const next = { ...prev } as Record<number, boolean>;
      if (allOnPageSelected) {
        for (const c of pageItems) delete next[c.id];
      } else {
        for (const c of pageItems) next[c.id] = true;
      }
      return next;
    });
  }

  function toggleOne(id: number) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function addSelectedToFavorites() {
    const chosen = sorted.filter((c) => selected[c.id]);
    if (!chosen.length) {
      addToast({ type: "info", message: "No characters selected" });
      return;
    }
    addMany(chosen.map((c) => ({ id: c.id, name: c.name, image: c.image })));
    addToast({ type: "success", message: `Added ${chosen.length} to favorites` });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="rounded border px-3 py-1 text-sm" onClick={addSelectedToFavorites}>
            Add Selected to Favorites
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <label>Page size</label>
          <select className="rounded border px-2 py-1 bg-transparent" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-black/10 dark:border-white/10">
              <th className="p-2"><input type="checkbox" checked={allOnPageSelected} onChange={toggleAllOnPage} /></th>
              <Th label="Name" active={sort.key === "name"} dir={sort.dir} onClick={() => toggleSort("name")} />
              <Th label="Status" active={sort.key === "status"} dir={sort.dir} onClick={() => toggleSort("status")} />
              <Th label="Species" active={sort.key === "species"} dir={sort.dir} onClick={() => toggleSort("species")} />
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.id} className="border-b border-black/10 dark:border-white/10">
                <td className="p-2 align-middle">
                  <input type="checkbox" checked={!!selected[c.id]} onChange={() => toggleOne(c.id)} />
                </td>
                <td className="p-2 align-middle">{c.name}</td>
                <td className="p-2 align-middle">{c.status}</td>
                <td className="p-2 align-middle">{c.species}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
