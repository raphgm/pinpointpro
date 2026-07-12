import React, { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'pinpointpro-theme-mode';
const DARK_CLASS = 'theme-dark';
const LIGHT_CLASS = 'theme-light';

export function useDarkMode(defaultMode: ThemeMode = 'dark') {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, themeMode === 'dark');
    document.documentElement.classList.toggle(LIGHT_CLASS, themeMode === 'light');
    window.localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  const toggleThemeMode = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { themeMode, toggleThemeMode, setThemeMode };
}

interface DarkModeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
  compact?: boolean;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  themeMode,
  onToggle,
  compact = false,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-white/10 focus:outline-none ${compact ? 'px-2 py-2' : ''}`}
      title={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span>{themeMode === 'dark' ? '🌙' : '☀️'}</span>
      {!compact && <span>{themeMode === 'dark' ? 'Dark mode' : 'Light mode'}</span>}
    </button>
  );
};