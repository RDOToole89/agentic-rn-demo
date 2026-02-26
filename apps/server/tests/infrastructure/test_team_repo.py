from datetime import datetime, timezone

from sqlalchemy.orm import Session

from src.domain.models.mood_entry import MoodEntry
from src.domain.models.team_member import TeamMember
from src.infrastructure.database.repositories.team_repo import TeamRepository


def _make_member(member_id: str = "m1", name: str = "Test") -> TeamMember:
    return TeamMember(
        id=member_id,
        name=name,
        role="Dev",
        status="active",
        mood_entries=[
            MoodEntry(
                id=f"{member_id}-e1",
                member_id=member_id,
                emoji="😊",
                label="Happy",
                timestamp=datetime(2026, 2, 26, 10, 0, tzinfo=timezone.utc),
            ),
            MoodEntry(
                id=f"{member_id}-e2",
                member_id=member_id,
                emoji="🔥",
                label="Fired Up",
                timestamp=datetime(2026, 2, 25, 10, 0, tzinfo=timezone.utc),
            ),
        ],
    )


class TestTeamRepository:
    def test_save_and_get_all(self, db: Session) -> None:
        repo = TeamRepository(db)
        repo.save_member(_make_member("m1", "Alice"))
        repo.save_member(_make_member("m2", "Bob"))

        members = repo.get_all()
        assert len(members) == 2
        names = {m.name for m in members}
        assert names == {"Alice", "Bob"}

    def test_get_by_id_found(self, db: Session) -> None:
        repo = TeamRepository(db)
        repo.save_member(_make_member("m1", "Alice"))

        member = repo.get_by_id("m1")
        assert member is not None
        assert member.name == "Alice"
        assert len(member.mood_entries) == 2

    def test_get_by_id_not_found(self, db: Session) -> None:
        repo = TeamRepository(db)
        assert repo.get_by_id("nonexistent") is None

    def test_mood_entries_ordered_by_timestamp_desc(self, db: Session) -> None:
        repo = TeamRepository(db)
        repo.save_member(_make_member("m1"))

        member = repo.get_by_id("m1")
        assert member is not None
        timestamps = [e.timestamp for e in member.mood_entries]
        assert timestamps == sorted(timestamps, reverse=True)

    def test_add_mood_entry(self, db: Session) -> None:
        repo = TeamRepository(db)
        repo.save_member(_make_member("m1"))

        new_entry = MoodEntry(
            id="m1-e3",
            member_id="m1",
            emoji="🎉",
            label="Celebrating",
            timestamp=datetime(2026, 2, 27, 10, 0, tzinfo=timezone.utc),
        )
        result = repo.add_mood_entry(new_entry)
        assert result.id == "m1-e3"
        assert result.emoji == "🎉"

        member = repo.get_by_id("m1")
        assert member is not None
        assert len(member.mood_entries) == 3
        assert member.mood_entries[0].id == "m1-e3"  # newest first

    def test_count(self, db: Session) -> None:
        repo = TeamRepository(db)
        assert repo.count() == 0
        repo.save_member(_make_member("m1"))
        assert repo.count() == 1
        repo.save_member(_make_member("m2"))
        assert repo.count() == 2

    def test_save_member_with_no_mood_entries(self, db: Session) -> None:
        repo = TeamRepository(db)
        member = TeamMember(id="m1", name="Test", role="Dev", status="active")
        repo.save_member(member)

        result = repo.get_by_id("m1")
        assert result is not None
        assert result.mood_entries == []
