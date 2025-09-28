'use client';

import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded border px-3 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
