# AGENTS.md — Feature: Home

Last updated: 2026-02-26

## Purpose

The Home feature is the app's dashboard landing screen. It displays a
time-of-day greeting with the user's name and navigation cards to other
features (Team Pulse, Settings).

## Files

| File | Role |
|------|------|
| `HomeScreen.tsx` | Main screen — greeting + navigation cards |
| `components/NavigationCard.tsx` | Reusable card with emoji, title, description, chevron |

## Dependencies

- `usePreferencesStore` (from `store/`) — reads `username`
- `@/tw` — NativeWind-enabled View, Text, ScrollView, Pressable, cn()
- `expo-router` — navigation to `/pulse`, `/settings`

## Styling

Uses NativeWind `className` props with semantic design tokens:
- `bg-surface` for screen background
- `bg-card` for navigation cards
- `text-accent` for username highlight
- `border-accent` / `border-accent-secondary` for card left borders
- `text-text-primary` / `text-text-secondary` for text hierarchy

## Constraints

- This screen is **read-only** — it does not mutate state
- All data comes from the Zustand store (already hydrated in `_layout.tsx`)
- No direct storage calls from this screen
- `getGreeting()` is a pure function based on current hour

## Extending This Feature

To add more navigation destinations:
1. Add a new `NavigationCard` in `HomeScreen.tsx`
2. Use an appropriate `accentClass` for visual distinction
3. Wire `onPress` to the new route
