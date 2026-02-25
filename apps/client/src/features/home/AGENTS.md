# AGENTS.md — Feature: Home

Last updated: 2026-02-25

## Purpose
The Home feature is the app's landing screen. It displays a greeting with the
user's name, the current theme mode, and a button to navigate to Settings.

## Files
| File              | Role                          |
|-------------------|-------------------------------|
| `HomeScreen.tsx`  | Main screen component         |

## Dependencies
- `usePreferencesStore` (from `store/`) — reads `username` and `darkMode`
- `@/tw` — NativeWind-enabled View, Text, Pressable components
- `expo-router` — navigation to `/settings`

## Styling
Uses NativeWind `className` props with semantic design tokens:
- `bg-surface` for background (adapts to dark mode)
- `text-text-primary` / `text-text-secondary` for text
- `bg-accent` for the CTA button (Deloitte green)

## Constraints
- This screen is **read-only** — it does not mutate state
- All data comes from the Zustand store (already hydrated in `_layout.tsx`)
- No direct storage calls from this screen

## Extending This Feature
To add content to the home screen (e.g., a feed, stats, etc.):
1. Create a subfolder `components/` in this directory
2. Add new components there
3. Import them into `HomeScreen.tsx`
4. If new data is needed, add it to the store or create an API query
