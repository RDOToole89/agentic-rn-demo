from datetime import datetime, timezone

import pytest
from sqlalchemy.orm import Session

from src.application.services.team_service import TeamService
from src.domain.models.mood_entry import MoodEntry
from src.domain.models.team_member import TeamMember
from src.infrastructure.database.repositories.team_repo import TeamRepository


def _seed_member(db: Session, member_id: str = "m1") -> None:
    repo = TeamRepository(db)
    member = TeamMember(
        id=member_id,
        name="Test User",
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
        ],
    )
    repo.save_member(member)


class TestTeamService:
    def test_get_all_members(self, db: Session) -> None:
        _seed_member(db, "m1")
        _seed_member(db, "m2")
        service = TeamService(TeamRepository(db))

        members = service.get_all_members()
        assert len(members) == 2

    def test_get_member_found(self, db: Session) -> None:
        _seed_member(db, "m1")
        service = TeamService(TeamRepository(db))

        member = service.get_member("m1")
        assert member is not None
        assert member.name == "Test User"

    def test_get_member_not_found(self, db: Session) -> None:
        service = TeamService(TeamRepository(db))
        assert service.get_member("nonexistent") is None

    def test_get_member_invalid_id_raises(self, db: Session) -> None:
        service = TeamService(TeamRepository(db))
        with pytest.raises(ValueError, match="alphanumeric"):
            service.get_member("bad@id")

    def test_submit_mood(self, db: Session) -> None:
        _seed_member(db, "m1")
        service = TeamService(TeamRepository(db))

        entry = service.submit_mood("m1", "🎉", "Celebrating")
        assert entry.emoji == "🎉"
        assert entry.label == "Celebrating"
        assert entry.member_id == "m1"

    def test_submit_mood_member_not_found(self, db: Session) -> None:
        service = TeamService(TeamRepository(db))
        with pytest.raises(ValueError, match="not found"):
            service.submit_mood("nonexistent", "😊", "Happy")

    def test_submit_mood_validates_emoji(self, db: Session) -> None:
        _seed_member(db, "m1")
        service = TeamService(TeamRepository(db))
        with pytest.raises(ValueError, match="10 characters"):
            service.submit_mood("m1", "x" * 11, "Test")

    def test_submit_mood_validates_label(self, db: Session) -> None:
        _seed_member(db, "m1")
        service = TeamService(TeamRepository(db))
        with pytest.raises(ValueError, match="50 characters"):
            service.submit_mood("m1", "😊", "x" * 51)

    def test_submit_mood_updates_member_current_mood(self, db: Session) -> None:
        _seed_member(db, "m1")
        service = TeamService(TeamRepository(db))

        service.submit_mood("m1", "🔥", "Fired Up")
        member = service.get_member("m1")
        assert member is not None
        assert member.current_mood is not None
        assert member.current_mood.emoji == "🔥"
        assert len(member.mood_entries) == 2
