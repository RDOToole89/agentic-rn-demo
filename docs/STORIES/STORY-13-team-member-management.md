---
id: STORY-13
title: Team & Member Management
status: backlog
labels: [type:feat, scope:client, scope:server]
issue: 20
---

# STORY-13: Team & Member Management

## Summary

Add the ability to create teams, add new members, and assign members to teams.
Introduces a Teams hub screen, team detail view, create-team flow, and
add-member bottom sheet — all backed by new server endpoints and domain entities.

## Context

The current Team Pulse dashboard shows a flat list of 8 hardcoded members with
no concept of organizational grouping. Real teams need structure — squads,
pods, project groups. This story introduces **Teams** as first-class entities
so users can:

- Organize members into meaningful groups (e.g., "Frontend Squad", "Design Pod")
- Create new teams with emoji icons and descriptions
- Add brand-new members (name + role + starting mood)
- Assign existing members to one or more teams
- View per-team pulse metrics alongside the existing all-team aggregate

This follows the **Hub & Spoke** pattern (Approach B from the feature
exploration): a dedicated Teams list screen that links to per-team detail views,
while the existing Pulse dashboard remains the all-teams aggregate.

### Why Hub & Spoke?

- Clean separation: management (CRUD) is distinct from observation (pulse)
- Scalable: adding more team actions later doesn't crowd the pulse screen
- Demo-friendly: shows clear navigation flow during a live presentation
- Each screen has a single responsibility

## Depends On

- STORY-05 (Team Pulse — Dashboard with mock data) ✅ merged
- STORY-08 (Backend — Team Pulse API endpoints) — for real persistence

> **Note:** This story can start with mock data (like STORY-05 did) and connect
> to the real backend later. The mock-first approach is recommended so UI work
> isn't blocked by the server story.

## Acceptance Criteria

### Data Model

- [ ] `Team` entity: `id`, `name`, `emoji`, `description`, `createdAt`
- [ ] `TeamMembership` join: `teamId`, `memberId`, `teamRole`, `joinedAt`
- [ ] A member can belong to multiple teams (many-to-many)
- [ ] Mock data includes 3 pre-built teams with members distributed across them

### Teams List Screen (`/teams`)

- [ ] Grid layout of team cards (2 columns) showing emoji, name, member count, aggregate mood
- [ ] "Create Team" button (header or FAB) opens the create-team flow
- [ ] Tapping a team card navigates to the team detail screen
- [ ] Empty state with illustration and "Create your first team" CTA
- [ ] Pull-to-refresh support
- [ ] Accessible from Home screen dashboard (new "Teams" widget or quick-access card)

### Team Detail Screen (`/teams/[id]`)

- [ ] Header: team emoji + name + description + member count
- [ ] Team pulse summary (reuse `TeamSummaryCard` filtered to team members)
- [ ] Member list using `FlashList` (or `FlatList`) — not `ScrollView`
- [ ] Each member row: avatar, name, role, status dot, current mood badge
- [ ] "Add Member" button opens the add-member bottom sheet
- [ ] Swipe-to-remove or long-press context menu for removing a member from the team
- [ ] Back navigation returns to teams list

### Create Team Flow (full-screen)

- [ ] Emoji picker (curated grid of ~24 team-relevant emojis, not a full library)
- [ ] Team name input (required, max 50 chars)
- [ ] Description input (optional, max 200 chars)
- [ ] "Add Members" step: searchable list of all workspace members with checkboxes
- [ ] Selected members shown as horizontal chip row above the search results
- [ ] Chip has "✕" to deselect
- [ ] "Create Team" primary CTA with member count (e.g., "Create Team (3 members)")
- [ ] Success: navigates to the new team's detail screen
- [ ] Cancel: confirmation if form has data, otherwise navigates back

### Add Member Bottom Sheet

- [ ] Opens as a half-screen bottom sheet (`@gorhom/bottom-sheet`)
- [ ] Two modes toggled by a segmented control at top:
  - **New Member**: name input, role input, starting mood picker, "Add" CTA
  - **Existing Member**: search input with filtered member list, tap to select, "Add to Team" CTA
- [ ] Keyboard-aware: sheet adjusts when keyboard opens
- [ ] Dismissible via backdrop tap (when form is empty) or close button
- [ ] Confirmation dialog if dismissing with partially filled form data
- [ ] Success: toast notification "Member added to {team name}"

### Navigation & Routing

- [ ] Route `app/teams/index.tsx` → `TeamsListScreen`
- [ ] Route `app/teams/[id].tsx` → `TeamDetailScreen`
- [ ] Route `app/teams/create.tsx` → `CreateTeamScreen` (or inline modal)
- [ ] All routes registered in `app/_layout.tsx`
- [ ] Home screen gets a "Teams" navigation card or widget

### Styling & Polish

- [ ] All components styled with NativeWind `className` + `dark:` variants
- [ ] Design tokens used for all colors (no hardcoded hex values)
- [ ] Team card uses `bg-card` / `border-border` from existing token system
- [ ] Emoji renders at consistent size across platforms
- [ ] Smooth transitions between screens
- [ ] Works on iOS, Android, and Web

### Documentation

- [ ] Feature-level `AGENTS.md` at `src/features/team-management/AGENTS.md`
- [ ] Update `apps/client/AGENTS.md` navigation table with new feature
- [ ] Update `docs/ARCHITECTURE.md` folder structure if needed
- [ ] Update root `AGENTS.md` if navigation table needs new entries

## Constraints

- **Mock data first** — Start with mock teams/members, connect to real API
  in a follow-up story (or extend STORY-09)
- **Bottom sheet library** — Use `@gorhom/bottom-sheet` (v5+). Must work on
  iOS, Android, and Web. Ask user before installing.
- **FlashList for member lists** — Use `@shopify/flash-list` v2 for virtualized
  lists. `ScrollView` is only acceptable if the list is guaranteed < 10 items.
- **No email/invite system** — This is a demo app. "Adding a member" means
  creating a fictional person, not sending a real invitation.
- **No auth/permissions** — All users can create teams and add members. No
  admin vs. member role enforcement.
- **Reuse existing components** — `Avatar`, `StatusDot`, `MoodBadge`,
  `MoodDistribution` from `src/features/pulse/components/` should be reused,
  not duplicated. Consider moving shared components to `packages/ui` if the
  dependency becomes awkward.
- **No animation work** — Entrance/exit animations are a separate concern
  (STORY-06 pattern). Focus on correctness and layout first.
- **Team emoji, not avatar upload** — Teams get an emoji icon, not a custom
  image. Keeps scope manageable.

## Feature Folder Structure

```
src/features/team-management/
├── AGENTS.md
├── TeamsListScreen.tsx
├── TeamDetailScreen.tsx
├── CreateTeamScreen.tsx
├── components/
│   ├── TeamCard.tsx                 # Grid card: emoji + name + count + vibe
│   ├── MemberRow.tsx                # List row: avatar + name + role + actions
│   ├── MemberSearchSelect.tsx       # Search + multi-select + chips
│   ├── AddMemberSheet.tsx           # Bottom sheet: new/existing member
│   ├── EmojiPicker.tsx              # Simple grid of curated emojis
│   ├── SelectedMemberChips.tsx      # Horizontal scrollable chip row
│   └── EmptyTeamState.tsx           # Empty state illustration + CTA
├── hooks/
│   ├── useTeams.ts                  # React Query: list all teams
│   ├── useTeamDetail.ts             # React Query: single team + members
│   ├── useCreateTeam.ts             # Mutation: create team
│   ├── useAddMember.ts              # Mutation: add member (new or existing)
│   ├── useRemoveMember.ts           # Mutation: remove member from team
│   └── useMemberSearch.ts           # Debounced search/filter
├── data/
│   └── mockTeams.ts                 # 3 teams with distributed members
└── types/
    └── types.ts                     # Team, TeamMembership, CreateTeamInput
```

## Server Additions (when wiring to backend)

```
Domain:
  src/domain/models/team.py          # Team + TeamMembership dataclasses

Infrastructure:
  src/infrastructure/database/models/team_model.py
  src/infrastructure/database/models/team_membership_model.py
  src/infrastructure/database/repositories/team_repo.py
  src/infrastructure/database/mappers/team_mapper.py

Application:
  src/application/services/team_service.py

API:
  src/api/v1/routes/teams.py
  src/api/v1/schemas/team_schemas.py

OpenAPI additions:
  GET    /api/v1/teams                    # List all teams
  POST   /api/v1/teams                    # Create team
  GET    /api/v1/teams/{id}               # Team detail + members
  PUT    /api/v1/teams/{id}               # Update team name/emoji/desc
  DELETE /api/v1/teams/{id}               # Delete team
  POST   /api/v1/teams/{id}/members       # Add member to team
  DELETE /api/v1/teams/{id}/members/{mid}  # Remove member from team
  POST   /api/v1/members                  # Create new member
```

## Files Touched

| File                                                | Action | Layer    |
| --------------------------------------------------- | ------ | -------- |
| `src/features/team-management/AGENTS.md`            | Create | Docs     |
| `src/features/team-management/TeamsListScreen.tsx`  | Create | Feature  |
| `src/features/team-management/TeamDetailScreen.tsx` | Create | Feature  |
| `src/features/team-management/CreateTeamScreen.tsx` | Create | Feature  |
| `src/features/team-management/components/*.tsx`     | Create | Feature  |
| `src/features/team-management/hooks/*.ts`           | Create | Feature  |
| `src/features/team-management/data/mockTeams.ts`    | Create | Feature  |
| `src/features/team-management/types/types.ts`       | Create | Feature  |
| `app/teams/index.tsx`                               | Create | Routing  |
| `app/teams/[id].tsx`                                | Create | Routing  |
| `app/teams/create.tsx`                              | Create | Routing  |
| `app/_layout.tsx`                                   | Modify | Routing  |
| `src/features/home/HomeScreen.tsx`                  | Modify | Feature  |
| `src/features/home/components/TeamsWidget.tsx`      | Create | Feature  |
| `src/api/keys.ts`                                   | Modify | Data     |
| `apps/client/AGENTS.md`                             | Modify | Docs     |
| `docs/ARCHITECTURE.md`                              | Modify | Docs     |
| `packages/core/openapi.json`                        | Modify | Contract |

## Out of Scope

- Real email/SMS invitation system
- Authentication and permission roles (admin vs. member)
- Avatar image upload for members or teams
- Team archiving or soft-delete
- Drag-and-drop member reordering
- Bulk import from CSV or contacts
- Team chat or messaging
- Notification system for team changes
- Entrance/exit animations (separate story, follow STORY-06 pattern)
- Real backend wiring (extend STORY-09 or create a new fullstack story)

## UX Reference

### Team Card (Teams List)

```
┌────────────────┐
│      🚀        │
│  Frontend      │
│  Squad         │
│                │
│  4 members     │
│  😊 vibe       │
└────────────────┘
```

### Add Member Bottom Sheet

```
┌─────────────────────────────┐
│  Add Member            ✕    │
│                             │
│  [New Member] [Existing]    │  ← segmented control
│                             │
│  Name                       │
│  ┌─────────────────────┐   │
│  │ Alex Thompson        │   │
│  └─────────────────────┘   │
│  Role                       │
│  ┌─────────────────────┐   │
│  │ Frontend Developer   │   │
│  └─────────────────────┘   │
│  Starting Mood              │
│  😊  🔥  😐  🤔  😴  😤   │
│                             │
│  [     Add Member      ]    │
└─────────────────────────────┘
```

### Create Team Flow

```
┌─────────────────────────────┐
│  ← Create Team              │
│                             │
│           🚀                │
│       Tap to pick           │
│                             │
│  Team Name *                │
│  ┌─────────────────────┐   │
│  │ Frontend Squad       │   │
│  └─────────────────────┘   │
│  Description                │
│  ┌─────────────────────┐   │
│  │ Our frontend crew    │   │
│  └─────────────────────┘   │
│                             │
│  Add Members                │
│  🔍 Search members...       │
│  [Sarah ✕] [Marcus ✕]      │
│                             │
│  ☐ Priya Patel              │
│  ☐ David Kim                │
│                             │
│  [  Create Team (2)    ]    │
└─────────────────────────────┘
```

## Testing Notes

- Verify team creation persists (in mock: added to local state / query cache)
- Verify member search filters correctly with debounce
- Verify multi-select chips update in real-time as members are checked/unchecked
- Verify removing a member from a team updates the team detail list
- Verify a member can appear in multiple teams
- Verify empty state renders when no teams exist
- Verify bottom sheet keyboard handling on iOS and Android
- Verify all screens render correctly in dark mode
- Verify web compatibility for all new routes
- Test edge cases: empty team name, duplicate team names, adding same member twice

## Open Questions

- Should the existing Pulse dashboard (`/pulse`) gain a team filter/picker, or
  remain the "all members" aggregate view?
- Should shared components (`Avatar`, `StatusDot`, `MoodBadge`) move to
  `packages/ui` now, or wait until a third feature needs them?
- Should `@gorhom/bottom-sheet` and `@shopify/flash-list` be installed as part
  of this story, or in a separate dependency-management story?
