---
id: STORY-04
title: Add NativeWind v5 + Design System
status: backlog
labels: [type:feat, scope:client]
issue: 6
---

# STORY-04: Add NativeWind v5 + Design System

## Summary

Replace `StyleSheet.create()` with NativeWind v5 (Tailwind CSS v4) and establish
a Deloitte-branded design token system with dark mode support across iOS, Android,
and Web.

## Context

The app currently uses `StyleSheet.create()` with inline style arrays for theming.
Every component needs `useTheme()` and `[styles.text, { color: colors.text }]`.
This doesn't scale and is verbose. NativeWind v5 brings `className` props with
`dark:` variants, CSS variables for dynamic theming, and a single token source
via `tailwind.config.ts`.

This is a Deloitte demo app, so the design system should use **Deloitte's official
brand colors** as the foundation. The primary green and supporting palette give
the app a polished, on-brand look that reinforces the professional context of the
presentation.

## Acceptance Criteria

- [ ] NativeWind v5 + Tailwind CSS v4 installed and configured
- [ ] Deloitte brand colors defined as source-of-truth constants in `src/theme/tokens.ts`
- [ ] Design tokens derived from Deloitte palette in `src/theme/tokens.ts` (colors, radius, typography, shadows)
- [ ] `tailwind.config.ts` extends theme with design tokens
- [ ] `global.css` with Tailwind v4 `@import` directives
- [ ] Metro config wrapped with `withNativeWind`
- [ ] Dark mode works via `dark:` class variants, synced from Zustand store
- [ ] HomeScreen migrated to `className` — no `StyleSheet.create`
- [ ] SettingsScreen migrated to `className` — no `StyleSheet.create`
- [ ] `colors.ts` deleted, replaced by `tokens.ts`
- [ ] `ThemeContext.tsx` simplified to thin NativeWind ↔ Zustand sync bridge
- [ ] Works on iOS, Android, and Web
- [ ] `nativewind-env.d.ts` provides TypeScript `className` support
- [ ] AGENTS.md updated with NativeWind stack and styling conventions

## Constraints

- NativeWind v5 (`@preview`) + Tailwind v4 — not v4/v3
- No custom fonts — use system defaults for the demo
- `Switch` and `TextInput` may keep minimal inline styles where `className` doesn't apply
- Zustand store stays as the source of truth for dark mode preference
- Design tokens must be importable by both `tailwind.config.ts` and app code

## Design Tokens — Deloitte Brand Palette

The token system is built on Deloitte's official brand colors, extended into
light/dark scales for UI use.

### Brand Colors (source of truth)

| Name           | Hex       | Usage                                                        |
| -------------- | --------- | ------------------------------------------------------------ |
| Deloitte Green | `#86BC25` | Primary actions, CTAs, active states, "Green Dot" brand mark |
| Deloitte Black | `#000000` | Text, headings, high-contrast backgrounds                    |
| Deloitte Blue  | `#002776` | Secondary actions, links, info states                        |
| Deloitte Cyan  | `#00A1DE` | Accents, highlights, interactive elements                    |
| Deloitte White | `#FFFFFF` | Backgrounds, cards, inverse text                             |

### Extended Token Scales

| Category         | Tokens                                                                  |
| ---------------- | ----------------------------------------------------------------------- |
| Primary (green)  | 50-900 scale derived from `#86BC25` — light tints to deep shades        |
| Secondary (blue) | 50-900 scale derived from `#002776` — used for links, info badges       |
| Accent (cyan)    | 50-900 scale derived from `#00A1DE` — highlights, focus rings           |
| Neutral          | 50-900 grayscale with slight warm tint toward Deloitte Black            |
| Surface          | `surface`, `surface-elevated`, `surface-sunken` (light & dark variants) |
| Semantic         | `success` (green), `error` (red), `warning` (amber) — functional only   |
| Border radius    | xs (2) → full (9999)                                                    |
| Font size        | xs (12px) → 3xl (28px) with line heights                                |
| Shadows          | sm, md, lg elevation levels                                             |
| Spacing          | Tailwind defaults (no override)                                         |

### Dark Mode Mapping

| Token              | Light           | Dark                                   |
| ------------------ | --------------- | -------------------------------------- |
| `bg-surface`       | White `#FFFFFF` | Near-black `#1A1A1A`                   |
| `text-primary`     | Black `#000000` | White `#FFFFFF`                        |
| `accent`           | Green `#86BC25` | Green `#9BD636` (lighter for contrast) |
| `accent-secondary` | Blue `#002776`  | Cyan `#00A1DE` (more visible on dark)  |

## Files Touched

| File                                       | Action  | Layer   |
| ------------------------------------------ | ------- | ------- |
| `package.json`                             | Modify  | Config  |
| `tailwind.config.ts`                       | Create  | Config  |
| `global.css`                               | Create  | Config  |
| `postcss.config.mjs`                       | Create  | Config  |
| `babel.config.js`                          | Create  | Config  |
| `nativewind-env.d.ts`                      | Create  | Config  |
| `metro.config.js`                          | Modify  | Config  |
| `src/theme/tokens.ts`                      | Create  | Theme   |
| `src/theme/colors.ts`                      | Delete  | Theme   |
| `src/theme/ThemeContext.tsx`               | Rewrite | Theme   |
| `app/_layout.tsx`                          | Modify  | Routing |
| `src/features/home/HomeScreen.tsx`         | Rewrite | Feature |
| `src/features/settings/SettingsScreen.tsx` | Rewrite | Feature |
| `AGENTS.md`                                | Modify  | Docs    |

## Out of Scope

- Custom fonts (Montserrat, etc.)
- Animation tokens / Reanimated CSS animations
- Component library / shared UI primitives
- Container queries
- Responsive breakpoints beyond dark mode
