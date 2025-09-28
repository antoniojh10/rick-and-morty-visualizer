'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
  toggle: () => void;
  setTheme: (t: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      } else {
        // Respect OS preference on first load
        const prefersDark =
          window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    } catch {}
  }, []);

  // Apply class to <html> for Tailwind and persist
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      window.localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggle = useCallback(() => setTheme(t => (t === 'dark' ? 'light' : 'dark')), []);

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
