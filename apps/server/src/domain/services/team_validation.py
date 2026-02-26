import re

VALID_STATUSES = {"active", "away", "offline"}


def validate_member_id(member_id: str) -> str:
    stripped = member_id.strip()
    if not stripped:
        raise ValueError("Member ID must not be empty")
    if not re.match(r"^[a-zA-Z0-9_-]+$", stripped):
        raise ValueError(
            "Member ID must contain only alphanumeric characters, hyphens, and underscores"
        )
    if len(stripped) > 100:
        raise ValueError("Member ID must be 100 characters or fewer")
    return stripped


def validate_mood_emoji(emoji: str) -> str:
    stripped = emoji.strip()
    if not stripped:
        raise ValueError("Mood emoji must not be empty")
    if len(stripped) > 10:
        raise ValueError("Mood emoji must be 10 characters or fewer")
    return stripped


def validate_mood_label(label: str) -> str:
    stripped = label.strip()
    if not stripped:
        raise ValueError("Mood label must not be empty")
    if len(stripped) > 50:
        raise ValueError("Mood label must be 50 characters or fewer")
    return stripped


def validate_status(status: str) -> str:
    stripped = status.strip().lower()
    if stripped not in VALID_STATUSES:
        raise ValueError(f"Status must be one of: {', '.join(sorted(VALID_STATUSES))}")
    return stripped
