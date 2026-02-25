/**
 * Deloitte brand constants and color scales.
 *
 * Single source of truth is global.css — this file exists only for the few
 * React Native components that need raw JS values (Switch trackColor,
 * StatusBar, etc.). Keep this in sync with the CSS tokens.
 */

import { vars } from 'nativewind';

// ---------------------------------------------------------------------------
// Brand core
// ---------------------------------------------------------------------------
export const brand = {
  green: '#86BC25', // Primary actions, CTAs, "Green Dot"
  black: '#000000', // Text, headings
  blue: '#002776', // Secondary actions, links
  cyan: '#00A1DE', // Accents, highlights
  white: '#FFFFFF', // Backgrounds, inverse text
} as const;

// ---------------------------------------------------------------------------
// Generated scales — primary (green)
// ---------------------------------------------------------------------------
export const primary = {
  50: '#F4F9E6',
  100: '#E5F2C4',
  200: '#D0E89E',
  300: '#B8DC73',
  400: '#9FD04D',
  500: '#86BC25', // brand.green
  600: '#6FA01E',
  700: '#578018',
  800: '#405F12',
  900: '#2B3F0D',
} as const;

// ---------------------------------------------------------------------------
// Generated scales — secondary (blue)
// ---------------------------------------------------------------------------
export const secondary = {
  50: '#E6EAF5',
  100: '#C0CCE6',
  200: '#95AAD4',
  300: '#6A88C2',
  400: '#4A6DB5',
  500: '#002776', // brand.blue
  600: '#002063',
  700: '#001950',
  800: '#00123D',
  900: '#000C2A',
} as const;

// ---------------------------------------------------------------------------
// Generated scales — accent (cyan)
// ---------------------------------------------------------------------------
export const accent = {
  50: '#E0F4FC',
  100: '#B3E4F7',
  200: '#80D3F1',
  300: '#4DC2EB',
  400: '#26B5E7',
  500: '#00A1DE', // brand.cyan
  600: '#0088BC',
  700: '#006E97',
  800: '#005573',
  900: '#003B4F',
} as const;

// ---------------------------------------------------------------------------
// Generated scales — neutral (warm gray)
// ---------------------------------------------------------------------------
export const neutral = {
  50: '#FAFAF8',
  100: '#F5F5F0',
  200: '#E8E8E2',
  300: '#D4D4CC',
  400: '#A8A8A0',
  500: '#787870',
  600: '#5C5C54',
  700: '#434340',
  800: '#2E2E2C',
  900: '#1A1A18',
} as const;

// ---------------------------------------------------------------------------
// Semantic theme vars — for NativeWind vars() bridge
// ---------------------------------------------------------------------------
export const lightTheme = vars({
  '--color-surface': '#FFFFFF',
  '--color-surface-elevated': '#FFFFFF',
  '--color-surface-sunken': '#F5F5F0',
  '--color-text-primary': '#000000',
  '--color-text-secondary': '#5C5C54',
  '--color-accent': '#86BC25',
  '--color-accent-secondary': '#002776',
  '--color-border': '#E8E8E2',
  '--color-card': '#FFFFFF',
  '--color-success': '#2D8A39',
  '--color-error': '#D42828',
  '--color-warning': '#E6A817',
});

export const darkTheme = vars({
  '--color-surface': '#1A1A1A',
  '--color-surface-elevated': '#242424',
  '--color-surface-sunken': '#111111',
  '--color-text-primary': '#FFFFFF',
  '--color-text-secondary': '#A0A0A0',
  '--color-accent': '#9BD636',
  '--color-accent-secondary': '#00A1DE',
  '--color-border': '#333333',
  '--color-card': '#1E1E1E',
  '--color-success': '#3DB54A',
  '--color-error': '#F04848',
  '--color-warning': '#F0C040',
});

// ---------------------------------------------------------------------------
// Raw values for RN components that don't support className
// (Switch trackColor, StatusBar, etc.)
// ---------------------------------------------------------------------------
export const rawColors = {
  light: {
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#5C5C54',
    accent: '#86BC25',
    border: '#E8E8E2',
    card: '#FFFFFF',
  },
  dark: {
    surface: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    accent: '#9BD636',
    border: '#333333',
    card: '#1E1E1E',
  },
} as const;
