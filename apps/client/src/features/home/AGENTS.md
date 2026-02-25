# AGENTS.md — Feature: Home

## Purpose
The Home feature is the app's landing screen. It displays a greeting with the
user's name, the current theme mode, and a button to navigate to Settings.

## Files
| File              | Role                          |
|-------------------|-------------------------------|
| `HomeScreen.tsx`  | Main screen component         |

## Dependencies
- `usePreferencesStore` (from `store/`) — reads `username`
- `useTheme` (from `theme/`) — reads color tokens and dark mode flag
- `expo-router` — navigation to `/settings`

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
