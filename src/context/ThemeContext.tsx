import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'camcodelearn_theme';

function applyDocumentTheme(theme: ThemeMode, disableTransitions = false) {
  const root = document.documentElement;
  if (disableTransitions) {
    root.classList.add('theme-switching');
  }
  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
  if (disableTransitions) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching');
      });
    });
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  useEffect(() => {
    applyDocumentTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const setTheme = (next: ThemeMode) => {
    applyDocumentTheme(next, true);
    setThemeState(next);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light';
      applyDocumentTheme(next, true);
      return next;
    });
  };

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

