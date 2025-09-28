"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface SelectionContextValue {
  selected: Record<number, boolean>;
  isSelected: (id: number) => boolean;
  toggle: (id: number) => void;
  toggleAll: (ids: number[]) => void;
  selectMany: (ids: number[]) => void;
  deselectMany: (ids: number[]) => void;
  clear: () => void;
}

const SelectionContext = createContext<SelectionContextValue | undefined>(undefined);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<Record<number, boolean>>({});

  const isSelected = useCallback((id: number) => !!selected[id], [selected]);

  const toggle = useCallback((id: number) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleAll = useCallback((ids: number[]) => {
    setSelected((prev) => {
      const allSelected = ids.every(id => prev[id]);
      const next = { ...prev } as Record<number, boolean>;
      
      if (allSelected) {
        // If all are selected, deselect all
        for (const id of ids) delete next[id];
      } else {
        // If not all are selected, select all
        for (const id of ids) next[id] = true;
      }
      
      return next;
    });
  }, []);

  const selectMany = useCallback((ids: number[]) => {
    setSelected((prev) => {
      const next = { ...prev } as Record<number, boolean>;
      for (const id of ids) next[id] = true;
      return next;
    });
  }, []);

  const deselectMany = useCallback((ids: number[]) => {
    setSelected((prev) => {
      const next = { ...prev } as Record<number, boolean>;
      for (const id of ids) delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected({}), []);

  const value = useMemo(
    () => ({ selected, isSelected, toggle, toggleAll, selectMany, deselectMany, clear }),
    [selected, isSelected, toggle, toggleAll, selectMany, deselectMany, clear]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
