/**
 * Theme sync bridge — connects Zustand darkMode preference to NativeWind's
 * color scheme. Components use NativeWind className tokens (bg-surface,
 * text-primary, etc.) which adapt automatically via light-dark() CSS.
 *
 * This replaces the old ThemeProvider + useTheme() pattern.
 */

import { useEffect } from 'react';
import { Appearance, useColorScheme } from 'react-native';
import { usePreferencesStore } from '../store/preferencesStore';
import { rawColors } from './tokens';

/** Sync Zustand darkMode → NativeWind colorScheme. Call once in root layout. */
export function useThemeSync() {
  const colorScheme = useColorScheme();
  const isDark = usePreferencesStore((s) => s.darkMode);

  useEffect(() => {
    Appearance.setColorScheme?.(isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, colorScheme };
}

/**
 * Raw color values for RN components that don't support className
 * (Switch trackColor, StatusBar, placeholderTextColor, etc.).
 */
export function useRawColors() {
  const isDark = usePreferencesStore((s) => s.darkMode);
  return isDark ? rawColors.dark : rawColors.light;
}
