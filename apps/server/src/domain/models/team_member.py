from __future__ import annotations

from dataclasses import dataclass, field

from src.domain.models.mood_entry import MoodEntry


@dataclass
class TeamMember:
    id: str
    name: str
    role: str
    status: str
    avatar_url: str | None = None
    mood_entries: list[MoodEntry] = field(default_factory=list)

    @property
    def current_mood(self) -> MoodEntry | None:
        return self.mood_entries[0] if self.mood_entries else None

    @property
    def mood_history(self) -> list[MoodEntry]:
        return self.mood_entries


def create_team_member(
    name: str,
    role: str,
    status: str,
    avatar_url: str | None = None,
    *,
    member_id: str | None = None,
) -> TeamMember:
    import uuid

    return TeamMember(
        id=member_id or str(uuid.uuid4()),
        name=name,
        role=role,
        status=status,
        avatar_url=avatar_url,
    )
