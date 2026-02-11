# ADR-008: Story-Driven Development with Board Sync

**Status**: Accepted

## Context

Without written specs, AI agents "vibe code" — they produce plausible but
unverifiable output. We need a system where every change is traceable to a
spec with acceptance criteria.

## Decision

Use **story specs** in `docs/STORIES/` as the single source of truth, synced
to GitHub Issues and a Project Board via a CLI script.

## The Flow

```
1. Write story spec    → docs/STORIES/STORY-XX-name.md
2. Run sync script     → .github/scripts/sync-stories.sh
3. Issue created       → GitHub Issues (with labels)
4. Added to board      → GitHub Project Board (#5)
5. Frontmatter updated → issue: <number> in the story file
```

## Story Frontmatter

```yaml
---
id: STORY-03
title: Add Notifications Feature
status: backlog        # backlog | ready | in-progress | done
labels: [type:feat, scope:mobile]
issue: null            # becomes issue number after sync
---
```

## Board Columns

Backlog → Ready → In progress → In review → Done

## Agent Workflow

When an AI agent picks up a story:
1. Read the story spec (acceptance criteria, constraints)
2. Read the relevant AGENTS.md files (root → app → feature)
3. Implement against the spec
4. Self-review against the PR checklist
5. Create PR referencing the story

## Consequences

- **Positive**: Every change is traceable to a spec
- **Positive**: Acceptance criteria prevent "done but wrong" implementations
- **Positive**: Stories live in the repo (version-controlled, reviewable)
- **Positive**: Board gives visibility without leaving the terminal (gh CLI)
- **Negative**: Extra step to write specs before coding (that's the point)
