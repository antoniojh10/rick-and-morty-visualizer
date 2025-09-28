'use client';

import { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { themeColors } from '@/styles/theme';

export default function ThemeColorUpdater() {
  const { theme } = useTheme();

  useEffect(() => {
    try {
      const color = theme === 'dark' ? themeColors.dark.themeColor : themeColors.light.themeColor;
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.content = color;
    } catch {}
  }, [theme]);

  return null;
}
