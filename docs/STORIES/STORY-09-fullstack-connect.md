---
id: STORY-09
title: Team Pulse — Connect Frontend to Live API
status: backlog
labels: [type:feat, scope:client]
issue: 11
last_updated: 2026-02-26
---

# STORY-09: Team Pulse — Connect Frontend to Live API

## Summary

Replace mock `queryFn` implementations with real `fetch()` calls to the FastAPI
backend, add environment config for the API base URL, and implement loading
skeletons, error states, and optimistic updates.

## Context

This is the capstone story that connects the frontend (STORY-05/06/07) to the
backend (STORY-08), demonstrating the full agentic development loop. The
frontend mock data hooks are replaced with real API calls, showing how the
architecture's clean boundaries make this swap straightforward.

## Depends On

- STORY-05 (Team Pulse — Dashboard with mock data)
- STORY-08 (Backend — Team Pulse API endpoints)

## Acceptance Criteria

- [ ] `useTeamMembers` hook fetches from `GET /api/v1/team` instead of mock data
- [ ] `useTeamMember(id)` hook fetches from `GET /api/v1/team/{id}`
- [ ] `useSubmitMood` mutation calls `POST /api/v1/team/{id}/mood`
- [ ] Environment config: API base URL from `.env` / app config
- [ ] Loading skeletons shown while data is fetching
- [ ] Error state UI when API is unreachable
- [ ] Optimistic update on mood/kudos submission (update cache before server confirms)
- [ ] Query invalidation after successful mutation
- [ ] Pull-to-refresh triggers real API refetch
- [ ] Works with backend running locally (`localhost`)
- [ ] Fallback to mock data if API is unavailable (graceful degradation)

## Constraints

- Only modify hook `queryFn` implementations — do not restructure components
- API base URL must be configurable (not hardcoded)
- Optimistic updates must roll back on mutation failure
- Skeleton components should match card layout dimensions
- No new dependencies beyond what's already installed

## Files Touched

| File                                                       | Action | Layer   |
| ---------------------------------------------------------- | ------ | ------- |
| `src/features/pulse/hooks/useTeamMembers.ts`               | Modify | Feature |
| `src/features/pulse/hooks/useTeamMember.ts`                | Modify | Feature |
| `src/features/pulse/hooks/useSubmitMood.ts`                | Modify | Feature |
| `src/features/pulse/components/TeamMemberCardSkeleton.tsx` | Create | Feature |
| `src/features/pulse/components/ErrorState.tsx`             | Create | Feature |
| `src/features/pulse/PulseDashboard.tsx`                    | Modify | Feature |
| `src/features/pulse/MemberDetail.tsx`                      | Modify | Feature |
| `src/lib/utils/api.ts`                                     | Create | Lib     |
| `src/features/pulse/AGENTS.md`                             | Modify | Docs    |

## Out of Scope

- WebSocket real-time updates
- Authentication headers
- Offline-first caching strategy
- Request retry UI (React Query handles retries silently)
- API versioning beyond `/v1/`

## Demo Notes

This story shows the power of the architecture-first approach:

- Swapping mock → real API only touches hook internals
- Components don't change at all — they consume the same React Query data
- The AGENTS.md boundary rules guided the AI to make minimal, correct changes
- Full-stack data flow: UI → React Query → fetch → FastAPI → SQLite → response → cache
