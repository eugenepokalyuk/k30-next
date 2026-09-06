'use client';

import { useEffect } from 'react';
import { useLocalStorageState } from 'react-stateful-hooks';

export type Theme = 'light' | 'dark';

/** Ключ хранения. */
export const THEME_STORAGE_KEY = 'k30-theme';

export const DEFAULT_THEME: Theme = 'light';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  set: (next: Theme) => void;
}

/** Тема оформления: выбор покупателя, сохранённый между заходами. */
export function useTheme(): ThemeState {
  const [theme, setTheme] = useLocalStorageState<Theme>(
    THEME_STORAGE_KEY,
    DEFAULT_THEME,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    set: setTheme,
  };
}
