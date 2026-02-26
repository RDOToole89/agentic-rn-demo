# AGENTS.md — Feature: Pulse

Last updated: 2026-02-26

## Purpose

The Pulse feature is the Team Pulse dashboard — the centrepiece of the app. It
shows a summary of team mood ("Team Vibe"), a mood submission picker, and an
interactive list of team member cards with avatars, status dots, mood badges,
and expandable mood history timelines.

## Files

| File                              | Role                                                |
| --------------------------------- | --------------------------------------------------- |
| `PulseDashboard.tsx`              | Main screen — ScrollView with pull-to-refresh       |
| `hooks/useTeamMembers.ts`         | React Query hook wrapping mock data                 |
| `hooks/useMoodSubmit.ts`          | Local state hook for mood submission + confirmation |
| `hooks/useStandupGenerator.ts`    | Hook for AI standup generation with loading state   |
| `data/mockTeamMembers.ts`         | 8 mock `TeamMember` records with mood history       |
| `utils/formatTime.ts`             | `formatRelativeTime()` — "5m ago", "Yesterday"      |
| `utils/generateStandup.ts`        | Pure function — mood analysis + 5 template variants |
| `components/Avatar.tsx`           | Colored-initials avatar circle                      |
| `components/StatusDot.tsx`        | Small colored dot (active/away/offline)             |
| `components/MoodBadge.tsx`        | Emoji + label badge                                 |
| `components/TeamMemberCard.tsx`   | Expandable card with mood timeline                  |
| `components/TeamSummaryCard.tsx`  | Hero card with vibe + distribution + status counts  |
| `components/MoodDistribution.tsx` | Horizontal stacked bar of mood percentages          |
| `components/MoodPicker.tsx`       | Emoji mood submission card                          |
| `components/StandupCard.tsx`      | AI standup card — idle/loading/summary states       |

## Data Flow

```
mockTeamMembers.ts → useTeamMembers (React Query) → PulseDashboard
                                                      ├── TeamSummaryCard
                                                      │     └── MoodDistribution
                                                      ├── MoodPicker (useMoodSubmit)
                                                      ├── StandupCard (useStandupGenerator)
                                                      │     └── generateStandup (pure fn)
                                                      └── TeamMemberCard[] (expandable)
                                                            ├── Avatar
                                                            ├── StatusDot
                                                            ├── MoodBadge
                                                            └── [expanded] mood timeline
```

## Dependencies

- `@agentic-rn/core` — `TeamMember`, `MoodEntry`, `TeamMemberStatus` types
- `@tanstack/react-query` — data fetching and caching
- `@/tw` — NativeWind components + `cn()` utility
- `queryKeys.team.all` — from `src/api/keys.ts`
- `useRawColors()` — for `ActivityIndicator` color (doesn't support className)
- `LayoutAnimation` — expand/collapse animation (built-in RN API)

## Route

`app/pulse/index.tsx` → re-exports `PulseDashboard`

## Constraints

- Mock data only — no real API calls yet (future story)
- 800ms simulated delay makes loading/refresh states visible in demos
- Avatar colors are deterministic (hash of name) — same name always gets same color
- Uses `ScrollView` + `.map()` instead of `FlatList` — FlatList doesn't work on web with NativeWind v5
- `react-native-reanimated` is installed but **not configured** (no babel plugin) — using `LayoutAnimation` instead
- Mood submission is local state only (mock — no API persistence)

## Mood → Color Mapping

Used by `MoodDistribution` and `TeamMemberCard` left border:

| Mood     | Color   |
| -------- | ------- |
| Happy    | #86BC25 |
| Fired Up | #E6A817 |
| Neutral  | #A8A8A0 |
| Thinking | #00A1DE |
| Tired    | #6A88C2 |
| Stressed | #D42828 |

## Future Stories

- Replace mock data with real API endpoint
- Persist mood submission to backend
- Mood history charts per team member
- Filter/sort by status or mood
