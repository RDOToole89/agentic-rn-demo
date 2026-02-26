---
id: STORY-12
title: AI Standup Summary (Demo Feature)
status: in-progress
labels: [type:feat, scope:client]
issue: 19
---

# STORY-12: AI Standup Summary (Demo Feature)

## Summary

Add an "AI Standup Summary" card to the Pulse dashboard that generates witty,
data-driven commentary from the team's mood data. Designed as a fun demo feature
— all generation is client-side template logic, no external API calls.

## Context

The Deloitte demo focuses on codebase architecture, but a fun live-demo feature
makes it more engaging. The standup generator touches multiple architectural
layers (pure utils, hooks, components, screen integration) while being safe for
a live demo (no external API calls that could fail on stage).

## Depends On

- STORY-05 (Team Pulse Dashboard) — provides TeamMember data and mock members

## Acceptance Criteria

- [ ] "AI Standup" section appears on PulseDashboard between MoodPicker and Team Members
- [ ] Tapping "Generate AI Standup" shows a loading animation (~1.5s)
- [ ] Summary text appears referencing actual team member names and moods
- [ ] Tapping "Regenerate" produces a different variation
- [ ] 4-5 template variations so repeated taps feel fresh
- [ ] Summary includes: dominant mood, outlier call-outs, streak observations, ship confidence
- [ ] Works on iOS, Android, and Web
- [ ] Dark mode renders correctly
- [ ] No FlatList usage (ScrollView only)
- [ ] Pull-to-refresh still works after adding the card
- [ ] `generateStandup` is a pure function with no external dependencies
- [ ] LayoutAnimation used for smooth summary appear/disappear

## Files Touched

| File                                              | Action | Layer   |
| ------------------------------------------------- | ------ | ------- |
| `docs/STORIES/STORY-12-ai-standup-summary.md`     | Create | Docs    |
| `src/features/pulse/utils/generateStandup.ts`     | Create | Util    |
| `src/features/pulse/hooks/useStandupGenerator.ts` | Create | Hook    |
| `src/features/pulse/components/StandupCard.tsx`   | Create | Feature |
| `src/features/pulse/PulseDashboard.tsx`           | Modify | Feature |
| `src/features/pulse/AGENTS.md`                    | Modify | Docs    |

## Out of Scope

- Real AI/LLM API calls (this is template-based)
- Persisting standup summaries
- Sharing standup to Slack/Teams
- Per-member detailed analysis

## Testing Notes

- Verify summary references actual member names from mock data
- Verify each "Regenerate" tap yields a different variation
- Verify loading state lasts ~1.5s with animated dots
- Verify LayoutAnimation doesn't flicker on web
- Verify dark mode card styling
