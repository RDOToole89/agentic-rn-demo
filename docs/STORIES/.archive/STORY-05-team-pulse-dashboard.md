---
id: STORY-05
title: Team Pulse — Dashboard with Mock Data
status: backlog
labels: [type:feat, scope:client]
issue: 7
last_updated: 2026-02-26
---

# STORY-05: Team Pulse — Dashboard with Mock Data

## Summary

Create the Team Pulse feature scaffold with a dashboard screen showing team
member cards in a FlatList, powered by mock data through React Query hooks.

## Context

The Team Pulse feature is the centrepiece of the Deloitte demo. This story
builds the static foundation — feature folder, types, mock data, and NativeWind-
styled components — so that STORY-06 (animations) and STORY-07 (detail screen)
can layer on top without touching the data or layout plumbing.

## Depends On

- STORY-04 (NativeWind v5 + Design System) — all styling uses `className`

## Acceptance Criteria

- [ ] Feature folder `src/features/pulse/` exists with `AGENTS.md`
- [ ] `PulseDashboard.tsx` renders a `FlatList` of team member cards
- [ ] `TeamMemberCard` component shows: avatar placeholder, name, role, status dot, mood emoji
- [ ] `StatusDot` component renders green/amber/red dot (plain, no animation yet)
- [ ] `MoodBadge` component renders an emoji mood indicator
- [ ] `useTeamMembers` hook returns mock data via React Query (`queryFn` returns hardcoded array)
- [ ] Query key factory added to `src/api/keys.ts` (`team.all`, `team.detail(id)`)
- [ ] Types `TeamMember` and `MoodEntry` added to `src/lib/types/`
- [ ] Route `app/pulse/index.tsx` renders `PulseDashboard`
- [ ] Navigation from HomeScreen to Pulse dashboard works
- [ ] Route registered in `app/_layout.tsx` with header title "Team Pulse"
- [ ] All components styled with NativeWind `className` + `dark:` variants
- [ ] Pull-to-refresh wired to React Query `refetch`
- [ ] Works on iOS, Android, and Web

## Constraints

- No animations — that's STORY-06
- No detail screen navigation — that's STORY-07
- Mock data only — no real API calls
- All styling via NativeWind `className`, no `StyleSheet.create`
- React Query hooks co-located in `src/features/pulse/hooks/`
- 6-8 mock team members with fun demo-appropriate names

## Mock Data Shape

```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  status: 'active' | 'away' | 'offline';
  currentMood: MoodEntry;
  moodHistory: MoodEntry[];
}

interface MoodEntry {
  emoji: string;
  label: string;
  timestamp: string; // ISO 8601
}
```

## Files Touched

| File                                               | Action | Layer   |
| -------------------------------------------------- | ------ | ------- |
| `src/features/pulse/AGENTS.md`                     | Create | Docs    |
| `src/features/pulse/PulseDashboard.tsx`            | Create | Feature |
| `src/features/pulse/components/TeamMemberCard.tsx` | Create | Feature |
| `src/features/pulse/components/StatusDot.tsx`      | Create | Feature |
| `src/features/pulse/components/MoodBadge.tsx`      | Create | Feature |
| `src/features/pulse/hooks/useTeamMembers.ts`       | Create | Feature |
| `src/lib/types/team.ts`                            | Create | Lib     |
| `src/lib/types/index.ts`                           | Modify | Lib     |
| `src/api/keys.ts`                                  | Modify | API     |
| `app/pulse/index.tsx`                              | Create | Routing |
| `app/_layout.tsx`                                  | Modify | Routing |
| `src/features/home/HomeScreen.tsx`                 | Modify | Feature |

## Out of Scope

- Reanimated animations (STORY-06)
- Member detail screen (STORY-07)
- Real API integration (STORY-09)
- MoodHistory timeline component (STORY-07)
- "Send Kudos" functionality (STORY-07)

## Testing Notes

- Verify FlatList renders correct number of cards
- Verify pull-to-refresh triggers React Query refetch
- Verify dark mode class variants render correctly
- Verify navigation from Home → Pulse works on all platforms
