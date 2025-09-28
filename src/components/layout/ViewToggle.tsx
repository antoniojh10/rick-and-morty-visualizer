'use client';

import { Grid, Table } from 'lucide-react';
import { useView } from '@/context/ViewContext';

export default function ViewToggle() {
  const { viewMode, setViewMode } = useView();

  return (
    <div className="flex items-center gap-1 border border-foreground/20 rounded-lg p-1 bg-foreground/5">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'grid'
            ? 'bg-background shadow-sm text-accent border border-accent/30'
            : 'text-foreground/60 hover:text-foreground hover:bg-background/50'
        }`}
        aria-label="Grid view"
        title="Grid view"
      >
        <Grid className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode('table')}
        className={`p-2 rounded transition-colors ${
          viewMode === 'table'
            ? 'bg-background shadow-sm text-accent border border-accent/30'
            : 'text-foreground/60 hover:text-foreground hover:bg-background/50'
        }`}
        aria-label="Table view"
        title="Table view"
      >
        <Table className="w-4 h-4" />
      </button>
    </div>
  );
}
