# AGENTS.md — Feature: Home

Last updated: 2026-02-26

## Purpose

The Home feature is the app's dashboard landing screen. It displays a
time-of-day greeting, a mood check-in picker, a compact team pulse summary
widget, a recent activity feed, and navigation cards to other features.

## Files

| File                             | Role                                                      |
| -------------------------------- | --------------------------------------------------------- |
| `HomeScreen.tsx`                 | Main screen — greeting, mood picker, widgets, nav grid    |
| `components/NavigationCard.tsx`  | Card with emoji + title; supports horizontal and compact  |
| `components/TeamPulseWidget.tsx` | Compact team vibe summary with mood bar and status counts |
| `components/ActivityFeed.tsx`    | Shows recent mood changes across team members             |

## Dependencies

- `usePreferencesStore` (from `store/`) — reads `username`
- `useTeamMembers` (from `features/pulse/hooks/`) — team member data via React Query
- `MoodPicker` (from `features/pulse/components/`) — mood check-in widget
- `StatusDot`, `MoodDistribution` (from `features/pulse/components/`) — used in TeamPulseWidget
- `Avatar` (from `features/pulse/components/`) — used in ActivityFeed
- `getMoodColor` (from `features/pulse/components/MoodDistribution`) — mood accent colors
- `formatRelativeTime` (from `features/pulse/utils/formatTime`) — relative timestamps
- `@agentic-rn/core` — `TeamMember`, `TeamMemberStatus` types
- `@/tw` — NativeWind-enabled View, Text, ScrollView, Pressable, cn()
- `expo-router` — navigation to `/pulse`, `/settings`

## Cross-Feature Imports

Home imports from the `pulse` feature for team data and UI components. This is
a pragmatic choice — the data is team-level, not pulse-specific. If more
features need team data, consider moving shared components and hooks to a
`shared/` layer or `packages/ui`.

## Styling

Uses NativeWind `className` props with semantic design tokens:

- `bg-surface` for screen background
- `bg-card` for widget cards
- `text-accent` for username highlight and interactive links
- `border-accent` / `border-accent-secondary` for card borders
- `text-text-primary` / `text-text-secondary` / `text-text-muted` for text hierarchy
- Section headers: `text-xs font-semibold text-text-secondary tracking-wider uppercase`

## Constraints

- `MoodPicker` uses internal `useMoodSubmit` hook — self-contained
- Team data comes via React Query (`useTeamMembers`) — cached/shared
- `ActivityFeed` derives recent activity from `members[].currentMood` timestamps
- No `FlatList` — uses `ScrollView` + `.map()` for web compatibility
- No `react-native-reanimated` — uses standard React Native animation APIs only
