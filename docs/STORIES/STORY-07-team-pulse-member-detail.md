---
id: STORY-07
title: Team Pulse — Member Detail Screen
status: backlog
labels: [type:feat, scope:client]
issue: 9
last_updated: 2026-02-26
---

# STORY-07: Team Pulse — Member Detail Screen

## Summary

Add a member detail screen with animated header, mood history timeline, and a
"Send Kudos" button wired to a mock React Query mutation.

## Context

The detail screen completes the Team Pulse feature's navigation flow. Users tap
a card on the dashboard → see the member's full profile with mood history →
can send kudos. This exercises dynamic routing, cache reads, mutations, and
Reanimated entrance animations.

## Depends On

- STORY-05 (Team Pulse — Dashboard with mock data)

## Acceptance Criteria

- [ ] `MemberDetail.tsx` screen with animated header (avatar + name + role)
- [ ] Dynamic route `app/pulse/[id].tsx` renders `MemberDetail`
- [ ] `useTeamMember(id)` hook reads from React Query cache or fetches single member
- [ ] `MoodHistory` timeline component shows last 5 mood entries with timestamps
- [ ] "Send Kudos" button triggers `useSubmitMood` mutation (mock — logs or shows toast)
- [ ] Card press on dashboard navigates to `/pulse/{id}` with params
- [ ] Back navigation returns to dashboard
- [ ] Slide-in entrance animation on detail screen (Reanimated)
- [ ] Styled with NativeWind `className` + `dark:` variants
- [ ] Route registered in `app/_layout.tsx`
- [ ] Works on iOS, Android, and Web

## Constraints

- Mock mutation only — no real API call (resolved in STORY-09)
- `useTeamMember` should try cache first (`initialData` from list query)
- MoodHistory is read-only — no editing past moods
- Keep detail screen simple — no tabs or complex navigation
- Reuse existing `StatusDot` and `MoodBadge` components from STORY-05

## Files Touched

| File                                               | Action | Layer   |
| -------------------------------------------------- | ------ | ------- |
| `src/features/pulse/MemberDetail.tsx`              | Create | Feature |
| `src/features/pulse/components/MoodHistory.tsx`    | Create | Feature |
| `src/features/pulse/hooks/useTeamMember.ts`        | Create | Feature |
| `src/features/pulse/hooks/useSubmitMood.ts`        | Create | Feature |
| `src/features/pulse/PulseDashboard.tsx`            | Modify | Feature |
| `src/features/pulse/components/TeamMemberCard.tsx` | Modify | Feature |
| `app/pulse/[id].tsx`                               | Create | Routing |
| `app/_layout.tsx`                                  | Modify | Routing |
| `src/features/pulse/AGENTS.md`                     | Modify | Docs    |

## Out of Scope

- Real API integration (STORY-09)
- Edit mood functionality for the current user
- Photo upload for avatar
- Shared element transition from card to detail
- Notification when kudos is received

## Testing Notes

- Verify dynamic route resolves with correct `id` param
- Verify cache-first strategy: navigating from list should not trigger new fetch
- Verify "Send Kudos" mutation shows feedback (toast or alert)
- Verify back navigation preserves dashboard scroll position
