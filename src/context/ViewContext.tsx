'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ViewMode = 'grid' | 'table';

interface ViewContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleView: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

interface ViewProviderProps {
  children: ReactNode;
}

export function ViewProvider({ children }: ViewProviderProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const toggleView = () => {
    setViewMode(prev => (prev === 'grid' ? 'table' : 'grid'));
  };

  return (
    <ViewContext.Provider value={{ viewMode, setViewMode, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
