# AGENTS.md — Feature: Pulse

Last updated: 2026-02-26

## Purpose

The Pulse feature is the Team Pulse dashboard — the centrepiece of the app. It
shows a summary of team mood ("Team Vibe") and a scrollable list of team member
cards with avatars, status dots, and mood badges.

## Files

| File | Role |
|------|------|
| `PulseDashboard.tsx` | Main screen — FlatList with pull-to-refresh |
| `hooks/useTeamMembers.ts` | React Query hook wrapping mock data |
| `data/mockTeamMembers.ts` | 8 mock `TeamMember` records |
| `components/Avatar.tsx` | Colored-initials avatar circle |
| `components/StatusDot.tsx` | Small colored dot (active/away/offline) |
| `components/MoodBadge.tsx` | Emoji + label badge |
| `components/TeamMemberCard.tsx` | Single team member row |
| `components/TeamSummaryCard.tsx` | Hero card with dominant mood + status counts |

## Data Flow

```
mockTeamMembers.ts → useTeamMembers (React Query) → PulseDashboard
                                                      ├── TeamSummaryCard
                                                      └── TeamMemberCard[]
                                                            ├── Avatar
                                                            ├── StatusDot
                                                            └── MoodBadge
```

## Dependencies

- `@agentic-rn/core` — `TeamMember`, `MoodEntry`, `TeamMemberStatus` types
- `@tanstack/react-query` — data fetching and caching
- `@/tw` — NativeWind components + `cn()` utility
- `queryKeys.team.all` — from `src/api/keys.ts`
- `useRawColors()` — for `ActivityIndicator` color (doesn't support className)

## Route

`app/pulse/index.tsx` → re-exports `PulseDashboard`

## Constraints

- Mock data only — no real API calls yet (future story)
- 800ms simulated delay makes loading/refresh states visible in demos
- Avatar colors are deterministic (hash of name) — same name always gets same color
- `FlatList` uses inline `contentContainerStyle` (NativeWind className caveat)

## Future Stories

- Replace mock data with real API endpoint
- Add mood submission (tap to change your own mood)
- Mood history charts per team member
- Filter/sort by status or mood
