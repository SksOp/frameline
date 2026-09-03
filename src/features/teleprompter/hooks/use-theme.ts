'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'frameline-theme';

type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

const themeListeners = new Set<() => void>();

function notifyThemeListeners() {
  for (const listener of themeListeners) {
    listener();
  }
}

export function sanitizeTheme(value: unknown): ThemePreference {
  if (value === 'system' || value === 'light' || value === 'dark') {
    return value;
  }
  return 'system';
}

export function readStoredTheme(storage: ThemeStorage): ThemePreference {
  try {
    const item = storage.getItem(THEME_STORAGE_KEY);
    return sanitizeTheme(item);
  } catch {
    return 'system';
  }
}

export function persistTheme(storage: ThemeStorage, theme: ThemePreference) {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Keep in-memory theme usable when Storage access is blocked.
  }
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') {
    return systemPrefersDark ? 'dark' : 'light';
  }
  return preference;
}

function getThemeSnapshot(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  return readStoredTheme(window.localStorage);
}

function getThemeServerSnapshot(): ThemePreference {
  return 'system';
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  themeListeners.add(callback);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener('storage', handleStorage);
  return () => {
    themeListeners.delete(callback);
    window.removeEventListener('storage', handleStorage);
  };
}

function getSystemDarkSnapshot(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getSystemDarkServerSnapshot(): boolean {
  return false;
}

function subscribeToSystemDark(callback: () => void) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {};
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  return () => {
    mediaQuery.removeEventListener('change', callback);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemDark,
    getSystemDarkSnapshot,
    getSystemDarkServerSnapshot,
  );
  const resolvedTheme = resolveTheme(theme, systemPrefersDark);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.setAttribute('data-theme', resolvedTheme);
    return () => {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    };
  }, [resolvedTheme]);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    try {
      persistTheme(window.localStorage, nextTheme);
    } catch {
      // Storage unavailable in constrained contexts.
    }
    notifyThemeListeners();
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: ThemePreference =
      resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
