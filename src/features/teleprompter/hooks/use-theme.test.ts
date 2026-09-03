import { describe, expect, it, vi } from 'vitest';
import {
  THEME_STORAGE_KEY,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  sanitizeTheme,
} from './use-theme';

describe('sanitizeTheme', () => {
  it('accepts valid theme values', () => {
    expect(sanitizeTheme('system')).toBe('system');
    expect(sanitizeTheme('light')).toBe('light');
    expect(sanitizeTheme('dark')).toBe('dark');
  });

  it("defaults to 'system' for invalid or unknown values", () => {
    expect(sanitizeTheme(null)).toBe('system');
    expect(sanitizeTheme(undefined)).toBe('system');
    expect(sanitizeTheme('')).toBe('system');
    expect(sanitizeTheme('solarized')).toBe('system');
    expect(sanitizeTheme(123)).toBe('system');
  });
});

describe('readStoredTheme and persistTheme', () => {
  it('reads stored preference from storage', () => {
    const storage = {
      getItem: vi.fn(() => 'dark'),
      setItem: vi.fn(),
    };
    expect(readStoredTheme(storage)).toBe('dark');
    expect(storage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
  });

  it('defaults to system when storage has no entry', () => {
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };
    expect(readStoredTheme(storage)).toBe('system');
  });

  it('handles storage throwing an error gracefully', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('SecurityError: Access is denied');
      }),
      setItem: vi.fn(),
    };
    expect(readStoredTheme(storage)).toBe('system');
  });

  it('persists theme preference to storage', () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };
    persistTheme(storage, 'dark');
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
  });
});

describe('resolveTheme', () => {
  it('resolves system preference based on system query', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('resolves explicit light and dark themes regardless of system query', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('light', false)).toBe('light');
    expect(resolveTheme('dark', true)).toBe('dark');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
