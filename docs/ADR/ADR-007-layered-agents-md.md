Last updated: 2026-02-26

**Status**: Accepted

## Context

AI coding agents (Claude Code, Copilot, Cursor) need context about a codebase
to make correct decisions. Too much context wastes tokens and causes
hallucination. Too little context causes boundary violations.

## Decision

Use a **3-level AGENTS.md hierarchy** that progressively discloses context:

```
Root AGENTS.md        (~400 tokens)  "What is this repo?"
  └── App AGENTS.md   (~500 tokens)  "What are the layers? Decision tree"
       └── Feature AGENTS.md (~200 tokens)  "What does this feature do?"
```

Total context for any task: **~1,100 tokens** across 3 files.

## What Each Level Contains

### Root (`/AGENTS.md`)

- Repository overview
- Monorepo structure
- Boundary rules
- Navigation table ("I need to... → go to...")
- Commit conventions

### App (`/apps/client/AGENTS.md`)

- Tech stack versions
- Architecture layers with dependency rules
- Decision tree: "Where does new code go?"
- Naming conventions
- React 19 patterns

### Feature (`/src/features/*/AGENTS.md`)

- Feature purpose (1-2 sentences)
- File table
- Data flow diagram
- Dependencies
- Constraints
- "How to extend" instructions

## Key Insight

**The architecture documentation IS the prompt.** Well-structured AGENTS.md
files mean you don't need elaborate system prompts or complex agent
configurations. The codebase teaches the agent how to work in it.

## Consequences

- **Positive**: Agents make correct decisions with minimal context (~600 tokens per task)
- **Positive**: New developers (human or AI) onboard in minutes, not hours
- **Positive**: Each level is independently maintainable
- **Positive**: No duplication — each level adds specificity without repeating
- **Negative**: Must be kept in sync with actual code (but small files are easy to update)
