---
id: STORY-02
title: Add Settings Feature
status: done
labels: [type:feat, scope:client]
issue: 4
last_updated: 2026-02-26
---

# STORY-02: Add Settings Feature

## Summary

Add a Settings screen where users can toggle dark mode and edit their username,
with changes persisted to local storage.

## Context

The app needs user-configurable preferences to demonstrate the full data flow:
UI → hook → store → use-case → service → persistence. This feature exercises
every layer of the architecture.

## Acceptance Criteria

- [ ] Settings screen accessible from Home via "Open Settings" button
- [ ] Username field: editable text input, persists on change (debounced)
- [ ] Dark mode toggle: Switch component, persists immediately
- [ ] Theme changes reflect across the entire app (Home + Settings)
- [ ] Username changes reflect on the Home screen greeting
- [ ] Values survive app restart (loaded from AsyncStorage on hydration)
- [ ] Feature-level AGENTS.md exists at `src/features/settings/AGENTS.md`

## Constraints

- Settings screen must NOT call AsyncStorage directly
- All persistence flows through: `useSettings hook → store → use-case → service`
- Username persistence must be debounced (500ms) to avoid excessive writes
- No new dependencies required — uses existing Zustand + AsyncStorage

## Files Touched

| File                                          | Action | Layer    |
| --------------------------------------------- | ------ | -------- |
| `src/domain/entities/UserPreferences.ts`      | Create | Domain   |
| `src/domain/use-cases/preferences.ts`         | Create | Domain   |
| `src/services/interfaces/IStorageService.ts`  | Create | Services |
| `src/services/storage/asyncStorageService.ts` | Create | Services |
| `src/shared/store/preferencesStore.ts`        | Create | Shared   |
| `src/features/settings/SettingsScreen.tsx`    | Create | Feature  |
| `src/features/settings/hooks/useSettings.ts`  | Create | Feature  |
| `src/features/settings/AGENTS.md`             | Create | Feature  |
| `src/theme/colors.ts`                         | Create | Theme    |
| `src/theme/ThemeContext.tsx`                  | Create | Theme    |
| `app/settings.tsx`                            | Create | Routing  |
| `app/_layout.tsx`                             | Modify | Routing  |

## Out of Scope

- Settings for notifications, language, or other preferences
- Server sync of preferences
- Settings screen animations or transitions
- Input validation (username length, forbidden chars)

## Testing Notes

When tests are introduced, this feature should have:

- Unit tests for `preferences.ts` use-case functions (mock IStorageService)
- Component test for SettingsScreen (mock store)
- Integration test for hydration flow
