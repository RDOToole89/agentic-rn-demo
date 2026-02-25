# AGENTS.md — Feature: Settings

Last updated: 2026-02-25

## Purpose
The Settings feature allows users to update their preferences (username and
dark mode). Changes persist to local storage via the Zustand store.

## Files
| File                    | Role                                      |
|-------------------------|-------------------------------------------|
| `SettingsScreen.tsx`    | Main screen — text input + dark mode toggle |
| `hooks/useSettings.ts`  | Feature hook — debounced persistence logic |

## Data Flow
```
SettingsScreen
  → useSettings hook
    → usePreferencesStore (Zustand)
      → lib/utils/storage.ts
        → AsyncStorage
```

## Dependencies
- `usePreferencesStore` (from `store/`) — read/write username and darkMode
- `useRawColors` (from `theme/`) — raw color values for Switch trackColor
- `@/tw` — NativeWind-enabled View, Text, TextInput components

## Styling
Uses NativeWind `className` props with semantic tokens. The `Switch` component
uses `useRawColors()` for `trackColor` since it doesn't support `className`.

## Constraints
- **Username debounce**: The hook waits 500ms before persisting username changes
  to avoid writing on every keystroke
- The screen component contains **zero business logic** — all logic lives in the hook

## Extending This Feature
To add a new preference (e.g., language, notifications):
1. Add the field to `lib/types/preferences.ts` and update `DEFAULT_PREFERENCES`
2. Add a store action in `store/preferencesStore.ts`
3. Add UI controls in `SettingsScreen.tsx`
4. Wire through `useSettings` hook
