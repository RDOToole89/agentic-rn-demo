import { createContext, use, useMemo, type ReactNode } from 'react';
import { type ColorTokens, lightColors, darkColors } from './colors';
import { usePreferencesStore } from '../store/preferencesStore';

interface ThemeContextValue {
  colors: ColorTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  isDark: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDark = usePreferencesStore((s) => s.darkMode);

  const value = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  return use(ThemeContext);
}
