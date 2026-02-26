"""Seed data for team members and mood entries.

Mirrors apps/client/src/features/pulse/data/mockTeamMembers.ts exactly.
Uses stable UUIDs so tests can reference specific members.
Idempotent: skips if team_members table already has rows.
"""

from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from src.domain.models.mood_entry import MoodEntry
from src.domain.models.team_member import TeamMember
from src.infrastructure.database.repositories.team_repo import TeamRepository

# Stable base time matching the mock data: 2026-02-26T10:00:00Z
BASE_TIME = datetime(2026, 2, 26, 10, 0, 0, tzinfo=timezone.utc)

# Stable UUIDs for deterministic testing
MEMBER_IDS = [
    "tm-00000001-0000-0000-0000-000000000001",
    "tm-00000002-0000-0000-0000-000000000002",
    "tm-00000003-0000-0000-0000-000000000003",
    "tm-00000004-0000-0000-0000-000000000004",
    "tm-00000005-0000-0000-0000-000000000005",
    "tm-00000006-0000-0000-0000-000000000006",
    "tm-00000007-0000-0000-0000-000000000007",
    "tm-00000008-0000-0000-0000-000000000008",
]


def _mood(
    member_id: str, emoji: str, label: str, hours_ago: float, entry_idx: int
) -> MoodEntry:
    """Create a mood entry relative to BASE_TIME."""
    return MoodEntry(
        id=f"me-{member_id[-1]}-{entry_idx:04d}",
        member_id=member_id,
        emoji=emoji,
        label=label,
        timestamp=BASE_TIME - timedelta(hours=hours_ago),
    )


def _build_members() -> list[TeamMember]:
    """Build 8 team members matching mockTeamMembers.ts."""
    return [
        TeamMember(
            id=MEMBER_IDS[0],
            name="Sarah Chen",
            role="Engineering Lead",
            avatar_url=None,
            status="active",
            mood_entries=[
                _mood(MEMBER_IDS[0], "\U0001f60a", "Happy", 1, 0),
                _mood(MEMBER_IDS[0], "\U0001f525", "Fired Up", 5, 1),
                _mood(MEMBER_IDS[0], "\U0001f60a", "Happy", 24, 2),
                _mood(MEMBER_IDS[0], "\U0001f914", "Thinking", 48, 3),
                _mood(MEMBER_IDS[0], "\U0001f60a", "Happy", 72, 4),
                _mood(MEMBER_IDS[0], "\U0001f610", "Neutral", 96, 5),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[1],
            name="Marcus Johnson",
            role="Senior Developer",
            avatar_url=None,
            status="active",
            mood_entries=[
                _mood(MEMBER_IDS[1], "\U0001f525", "Fired Up", 1.25, 0),
                _mood(MEMBER_IDS[1], "\U0001f525", "Fired Up", 8, 1),
                _mood(MEMBER_IDS[1], "\U0001f60a", "Happy", 26, 2),
                _mood(MEMBER_IDS[1], "\U0001f914", "Thinking", 50, 3),
                _mood(MEMBER_IDS[1], "\U0001f634", "Tired", 74, 4),
                _mood(MEMBER_IDS[1], "\U0001f60a", "Happy", 100, 5),
                _mood(MEMBER_IDS[1], "\U0001f525", "Fired Up", 120, 6),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[2],
            name="Priya Patel",
            role="UX Designer",
            avatar_url=None,
            status="active",
            mood_entries=[
                _mood(MEMBER_IDS[2], "\U0001f60a", "Happy", 0.75, 0),
                _mood(MEMBER_IDS[2], "\U0001f914", "Thinking", 6, 1),
                _mood(MEMBER_IDS[2], "\U0001f60a", "Happy", 25, 2),
                _mood(MEMBER_IDS[2], "\U0001f60a", "Happy", 49, 3),
                _mood(MEMBER_IDS[2], "\U0001f525", "Fired Up", 73, 4),
                _mood(MEMBER_IDS[2], "\U0001f610", "Neutral", 97, 5),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[3],
            name="David Kim",
            role="Backend Developer",
            avatar_url=None,
            status="away",
            mood_entries=[
                _mood(MEMBER_IDS[3], "\U0001f610", "Neutral", 2.5, 0),
                _mood(MEMBER_IDS[3], "\U0001f634", "Tired", 10, 1),
                _mood(MEMBER_IDS[3], "\U0001f610", "Neutral", 28, 2),
                _mood(MEMBER_IDS[3], "\U0001f60a", "Happy", 52, 3),
                _mood(MEMBER_IDS[3], "\U0001f914", "Thinking", 76, 4),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[4],
            name="Aisha Mohammed",
            role="Product Manager",
            avatar_url=None,
            status="active",
            mood_entries=[
                _mood(MEMBER_IDS[4], "\U0001f60a", "Happy", 0.5, 0),
                _mood(MEMBER_IDS[4], "\U0001f525", "Fired Up", 4, 1),
                _mood(MEMBER_IDS[4], "\U0001f60a", "Happy", 24, 2),
                _mood(MEMBER_IDS[4], "\U0001f525", "Fired Up", 48, 3),
                _mood(MEMBER_IDS[4], "\U0001f60a", "Happy", 72, 4),
                _mood(MEMBER_IDS[4], "\U0001f624", "Stressed", 96, 5),
                _mood(MEMBER_IDS[4], "\U0001f60a", "Happy", 120, 6),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[5],
            name="Tom Rivera",
            role="QA Engineer",
            avatar_url=None,
            status="active",
            mood_entries=[
                _mood(MEMBER_IDS[5], "\U0001f634", "Tired", 2, 0),
                _mood(MEMBER_IDS[5], "\U0001f610", "Neutral", 9, 1),
                _mood(MEMBER_IDS[5], "\U0001f634", "Tired", 27, 2),
                _mood(MEMBER_IDS[5], "\U0001f60a", "Happy", 51, 3),
                _mood(MEMBER_IDS[5], "\U0001f610", "Neutral", 75, 4),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[6],
            name="Elena Volkov",
            role="DevOps Engineer",
            avatar_url=None,
            status="away",
            mood_entries=[
                _mood(MEMBER_IDS[6], "\U0001f914", "Thinking", 3.25, 0),
                _mood(MEMBER_IDS[6], "\U0001f60a", "Happy", 12, 1),
                _mood(MEMBER_IDS[6], "\U0001f914", "Thinking", 30, 2),
                _mood(MEMBER_IDS[6], "\U0001f525", "Fired Up", 54, 3),
                _mood(MEMBER_IDS[6], "\U0001f60a", "Happy", 78, 4),
                _mood(MEMBER_IDS[6], "\U0001f610", "Neutral", 102, 5),
            ],
        ),
        TeamMember(
            id=MEMBER_IDS[7],
            name="James O'Brien",
            role="Data Analyst",
            avatar_url=None,
            status="offline",
            mood_entries=[
                _mood(MEMBER_IDS[7], "\U0001f525", "Fired Up", 17, 0),
                _mood(MEMBER_IDS[7], "\U0001f60a", "Happy", 30, 1),
                _mood(MEMBER_IDS[7], "\U0001f610", "Neutral", 54, 2),
                _mood(MEMBER_IDS[7], "\U0001f914", "Thinking", 78, 3),
                _mood(MEMBER_IDS[7], "\U0001f60a", "Happy", 102, 4),
            ],
        ),
    ]


def seed_team_data(db: Session) -> None:
    """Insert seed team members if the table is empty. Idempotent."""
    repo = TeamRepository(db)
    if repo.count() > 0:
        return

    for member in _build_members():
        repo.save_member(member)
