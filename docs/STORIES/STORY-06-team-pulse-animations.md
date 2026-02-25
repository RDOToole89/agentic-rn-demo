---
id: STORY-06
title: Team Pulse — Reanimated Animations
status: backlog
labels: [type:feat, scope:client]
issue: 8
---

# STORY-06: Team Pulse — Reanimated Animations

## Summary
Add polished Reanimated animations to the Pulse dashboard: staggered card
entrance, press-to-scale feedback, and a pulsing status dot indicator.

## Context
This is the **live demo story** for the Deloitte presentation. It is designed to
be visually impressive, self-contained, and quick for AI to implement (~5 min).
All data and layout are already in place from STORY-05; this story only adds
animation wrappers and gesture feedback.

## Depends On
- STORY-05 (Team Pulse — Dashboard with mock data)

## Acceptance Criteria

- [ ] `react-native-reanimated` installed and configured (Babel plugin)
- [ ] Staggered card entrance: each card fades in + slides up with increasing delay per index
- [ ] Card press scale animation: `withSpring` shrinks card to 0.97 on press-in, springs back on release
- [ ] `StatusDot` pulsing animation: infinite opacity loop (1 → 0.3 → 1) for `active` status
- [ ] Pull-to-refresh has animated rotation indicator (or uses native RefreshControl)
- [ ] Cards wrapped in `Animated.View` from `react-native-reanimated`
- [ ] All animations use `useAnimatedStyle` / `entering` props (no `Animated` from RN core)
- [ ] Animations work on iOS, Android, and Web
- [ ] No layout shifts or flicker during entrance animation
- [ ] Performance: smooth 60fps on mid-range device

## Constraints

- Do not change data layer or mock data — only add animation wrappers
- Do not add new screens — this story is purely visual
- Use `react-native-reanimated` v3+ (not the legacy API)
- Entrance animations should use `entering={FadeInUp.delay(index * 100)}` pattern
- Keep animation durations between 200-400ms for snappy feel
- StatusDot pulse only for `active` status; `away` and `offline` are static

## Animation Specs

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Card entrance | FadeInUp + stagger | 300ms + 100ms/index | spring (damping 15) |
| Card press | Scale 1 → 0.97 → 1 | 150ms | withSpring |
| StatusDot pulse | Opacity 1 → 0.3 → 1 | 1500ms loop | withTiming (easeInOut) |

## Files Touched

| File | Action | Layer |
|------|--------|-------|
| `package.json` | Modify | Config |
| `babel.config.js` | Modify | Config |
| `src/features/pulse/PulseDashboard.tsx` | Modify | Feature |
| `src/features/pulse/components/TeamMemberCard.tsx` | Modify | Feature |
| `src/features/pulse/components/StatusDot.tsx` | Modify | Feature |
| `src/features/pulse/components/AnimatedCard.tsx` | Create | Feature |

## Out of Scope

- Detail screen animations (STORY-07)
- Gesture-based swipe actions on cards
- Shared element transitions
- Lottie or SVG animations
- Layout animations (LayoutAnimation API)

## Demo Notes

This story is designed for live implementation during the presentation:

1. Show the static dashboard (STORY-05 already merged)
2. Pick up STORY-06, create branch, assign to AI
3. AI adds ~4 files of animation code
4. Show the before/after on device — dramatic visual improvement
5. Walk through the PR: "AI understood the AGENTS.md context and only touched animation layer"
