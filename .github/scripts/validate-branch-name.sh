#!/usr/bin/env bash
# Validates branch name against project conventions.
# Called by lefthook pre-push hook.
#
# Allowed patterns:
#   - main, develop
#   - (feat|fix|refactor|test)/STORY-{NN}-{slug}
#   - (chore|docs)/STORY-{NN}-{slug}  (STORY prefix optional for chore/docs)
#   - (chore|docs)/{slug}

set -euo pipefail

BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Allow special branches
if [[ "$BRANCH" == "main" || "$BRANCH" == "develop" ]]; then
  exit 0
fi

# Allow story-linked branches: type/STORY-NN-slug
STORY_REGEX='^(feat|fix|refactor|docs|test|chore)/STORY-[0-9]+-[a-z0-9-]+$'
if echo "$BRANCH" | grep -qE "$STORY_REGEX"; then
  exit 0
fi

# Allow chore/docs branches without STORY prefix: chore/slug or docs/slug
CHORE_DOCS_REGEX='^(chore|docs)/[a-z0-9-]+$'
if echo "$BRANCH" | grep -qE "$CHORE_DOCS_REGEX"; then
  exit 0
fi

echo ""
echo "ERROR: Invalid branch name: $BRANCH"
echo ""
echo "  Allowed patterns:"
echo "    main"
echo "    develop"
echo "    feat/STORY-05-team-pulse-dashboard"
echo "    fix/STORY-06-animation-flicker"
echo "    chore/STORY-10-lefthook"
echo "    chore/update-deps"
echo "    docs/api-guide"
echo ""
echo "  Format: {type}/STORY-{NN}-{slug}  or  {chore|docs}/{slug}"
echo "  Types:  feat, fix, refactor, docs, test, chore"
echo ""
exit 1
