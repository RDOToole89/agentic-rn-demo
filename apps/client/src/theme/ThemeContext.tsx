/**
 * Theme sync bridge — connects Zustand darkMode preference to NativeWind's
 * color scheme. Components use NativeWind className tokens (bg-surface,
 * text-primary, etc.) which adapt automatically via light-dark() CSS.
 *
 * This replaces the old ThemeProvider + useTheme() pattern.
 */

import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from 'nativewind';
import { usePreferencesStore } from '../store/preferencesStore';
import { rawColors } from './tokens';

/** Sync Zustand darkMode → NativeWind colorScheme. Call once in root layout. */
export function useThemeSync() {
  const { setColorScheme, colorScheme } = useColorScheme();
  const isDark = usePreferencesStore((s) => s.darkMode);

  useEffect(() => {
    // On native, sync via Appearance API
    if (Platform.OS !== 'web') {
      setColorScheme(isDark ? 'dark' : 'light');
    }
    // On web, set color-scheme on <html> so light-dark() CSS responds
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    }
  }, [isDark, setColorScheme]);

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
