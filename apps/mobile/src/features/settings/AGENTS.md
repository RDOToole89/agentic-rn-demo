# AGENTS.md — Feature: Settings

## Purpose
The Settings feature allows users to update their preferences (username and
dark mode). Changes persist to local storage via the domain use-case layer.

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
      → domain/use-cases/preferences.ts
        → services/storage/asyncStorageService.ts
          → AsyncStorage
```

## Dependencies
- `usePreferencesStore` — read/write username and darkMode
- `useTheme` — color tokens for styled rendering
- `domain/use-cases/preferences.ts` — business logic (called by store)

## Constraints
- **Username debounce**: The hook waits 500ms before persisting username changes
  to avoid writing on every keystroke
- **No direct AsyncStorage access** — always goes through the service interface
- The screen component contains **zero business logic** — all logic lives in the hook

## Extending This Feature
To add a new preference (e.g., language, notifications):
1. Add the field to `domain/entities/UserPreferences.ts`
2. Add a use-case function in `domain/use-cases/preferences.ts`
3. Add a store action in `shared/store/preferencesStore.ts`
4. Add UI controls in `SettingsScreen.tsx`
5. Wire through `useSettings` hook
