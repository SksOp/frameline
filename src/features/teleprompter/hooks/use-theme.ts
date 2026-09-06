'use client';

import { useEffect, useSyncExternalStore } from 'react';

export type ResolvedTheme = 'light' | 'dark';

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

/** Follows the OS light/dark preference; there is no in-app override. */
export function useTheme() {
  const systemPrefersDark = useSyncExternalStore(
    subscribeToSystemDark,
    getSystemDarkSnapshot,
    getSystemDarkServerSnapshot,
  );
  const resolvedTheme: ResolvedTheme = systemPrefersDark ? 'dark' : 'light';

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.setAttribute('data-theme', resolvedTheme);
    return () => {
      root.classList.remove('dark');
      root.removeAttribute('data-theme');
    };
  }, [resolvedTheme]);

  return { resolvedTheme };
}
