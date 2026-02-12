#!/usr/bin/env bash
set -euo pipefail

# Sync stories from docs/STORIES/ to GitHub Issues and Project Board
#
# Usage: .github/scripts/sync-stories.sh [--dry-run]
#
# Reads frontmatter from STORY-*.md files. For each story with `issue: null`,
# creates a GitHub Issue, adds it to the project board, and updates the
# frontmatter with the issue number.

REPO="RDOToole89/agentic-rn-demo"
PROJECT_NUMBER=5
PROJECT_OWNER="RDOToole89"
STORIES_DIR="docs/STORIES"
DRY_RUN=false

[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

# Parse frontmatter value by key
parse_frontmatter() {
  local file="$1"
  local key="$2"
  sed -n '/^---$/,/^---$/p' "$file" | grep "^${key}:" | sed "s/^${key}: *//"
}

# Extract the body (everything after the second ---)
extract_body() {
  local file="$1"
  awk 'BEGIN{n=0} /^---$/{n++; next} n>=2{print}' "$file"
}

# Parse labels from frontmatter: [type:feat, scope:client] -> array
parse_labels() {
  local raw="$1"
  echo "$raw" | tr -d '[]' | tr ',' '\n' | sed 's/^ *//' | sed 's/ *$//'
}

echo "=== Story → Issue Sync ==="
echo ""

synced=0
skipped=0

for story_file in ${STORIES_DIR}/STORY-*.md; do
  [[ "$(basename "$story_file")" == "_TEMPLATE.md" ]] && continue

  story_id=$(parse_frontmatter "$story_file" "id")
  title=$(parse_frontmatter "$story_file" "title")
  status=$(parse_frontmatter "$story_file" "status")
  labels_raw=$(parse_frontmatter "$story_file" "labels")
  issue=$(parse_frontmatter "$story_file" "issue")

  echo "[$story_id] $title"
  echo "  status: $status | issue: ${issue:-null}"

  # Skip if already synced
  if [[ "$issue" != "null" && -n "$issue" ]]; then
    echo "  → Already synced to #$issue, skipping"
    skipped=$((skipped + 1))
    echo ""
    continue
  fi

  if $DRY_RUN; then
    echo "  → [DRY RUN] Would create issue: '$story_id: $title'"
    echo "  → Labels: $labels_raw"
    echo ""
    continue
  fi

  # Write body to a temp file to avoid shell escaping issues
  tmpfile=$(mktemp)
  extract_body "$story_file" > "$tmpfile"

  # Build gh issue create command with labels
  label_args=()
  while IFS= read -r label; do
    [[ -n "$label" ]] && label_args+=(--label "$label")
  done < <(parse_labels "$labels_raw")

  # Create the issue using --body-file to avoid shell escaping
  issue_url=$(gh issue create \
    --repo "$REPO" \
    --title "${story_id}: ${title}" \
    --body-file "$tmpfile" \
    "${label_args[@]}" 2>&1)

  rm -f "$tmpfile"

  issue_number=$(echo "$issue_url" | grep -o '[0-9]*$')
  echo "  → Created issue #$issue_number ($issue_url)"

  # Add to project board
  gh project item-add "$PROJECT_NUMBER" \
    --owner "$PROJECT_OWNER" \
    --url "$issue_url" 2>/dev/null && \
    echo "  → Added to project board" || \
    echo "  → Warning: could not add to board"

  # Update the frontmatter in the story file
  sed -i '' "s/^issue: null$/issue: ${issue_number}/" "$story_file"
  echo "  → Updated frontmatter: issue: $issue_number"

  synced=$((synced + 1))
  echo ""
done

echo "=== Done: $synced synced, $skipped skipped ==="
