'use client';

import { useEffect } from 'react';
import { useReadingStore } from '@/lib/stores';

const THEME_MAP: Record<string, string> = {
  default: '',
  midnight: 'midnight',
  paper: 'paper',
  cyberpunk: 'cyberpunk',
  forest: 'forest',
  ocean: 'ocean',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useReadingStore((s) => s.theme);

  useEffect(() => {
    const themeValue = THEME_MAP[theme] || '';
    if (themeValue) {
      document.documentElement.setAttribute('data-theme', themeValue);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  return <>{children}</>;
}
