"use client";

import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Status } from "@/types/character";

export type SortOrder = "az" | "za";

export interface FiltersState {
  name: string;
  status: Status | "";
  sort: SortOrder;
}

export default function CharacterFilters({
  value,
  onChange,
}: {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
}) {
  const [name, setName] = useState(value.name);
  const [status, setStatus] = useState<Status | "">(value.status);
  const [sort, setSort] = useState<SortOrder>(value.sort);

  const debouncedName = useDebounce(name, 300);

  useEffect(() => {
    onChange({ name: debouncedName, status, sort });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, status, sort]);

  // Update local inputs if parent changes (e.g., reset)
  useEffect(() => {
    setName(value.name);
    setStatus(value.status);
    setSort(value.sort);
  }, [value.name, value.status, value.sort]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1">
        <label className="block text-sm mb-1">Search (min 2 chars)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search by name"
          className="w-full rounded border px-3 py-2 bg-transparent"
        />
      </div>
      <div>
        <label className="block text-sm mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | "")}
          className="rounded border px-3 py-2 bg-transparent"
        >
          <option value="">All</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
          className="rounded border px-3 py-2 bg-transparent"
        >
          <option value="az">A → Z</option>
          <option value="za">Z → A</option>
        </select>
      </div>
    </div>
  );
}
