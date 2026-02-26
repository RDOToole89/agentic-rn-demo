from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass
class MoodEntry:
    id: str
    member_id: str
    emoji: str
    label: str
    timestamp: datetime


def create_mood_entry(
    member_id: str,
    emoji: str,
    label: str,
    *,
    entry_id: str | None = None,
) -> MoodEntry:
    import uuid

    return MoodEntry(
        id=entry_id or str(uuid.uuid4()),
        member_id=member_id,
        emoji=emoji,
        label=label,
        timestamp=datetime.now(timezone.utc),
    )
