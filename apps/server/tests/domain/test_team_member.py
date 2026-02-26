from datetime import datetime, timezone

from src.domain.models.mood_entry import MoodEntry, create_mood_entry
from src.domain.models.team_member import TeamMember, create_team_member


class TestTeamMemberDataclass:
    def test_current_mood_returns_first_entry(self) -> None:
        entries = [
            MoodEntry(id="1", member_id="m1", emoji="a", label="A", timestamp=datetime(2026, 1, 2, tzinfo=timezone.utc)),
            MoodEntry(id="2", member_id="m1", emoji="b", label="B", timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc)),
        ]
        member = TeamMember(id="m1", name="Test", role="Dev", status="active", mood_entries=entries)
        assert member.current_mood is not None
        assert member.current_mood.id == "1"

    def test_current_mood_returns_none_when_empty(self) -> None:
        member = TeamMember(id="m1", name="Test", role="Dev", status="active")
        assert member.current_mood is None

    def test_mood_history_is_alias_for_mood_entries(self) -> None:
        entries = [
            MoodEntry(id="1", member_id="m1", emoji="a", label="A", timestamp=datetime(2026, 1, 1, tzinfo=timezone.utc)),
        ]
        member = TeamMember(id="m1", name="Test", role="Dev", status="active", mood_entries=entries)
        assert member.mood_history is member.mood_entries

    def test_default_mood_entries_is_empty(self) -> None:
        member = TeamMember(id="m1", name="Test", role="Dev", status="active")
        assert member.mood_entries == []

    def test_default_avatar_url_is_none(self) -> None:
        member = TeamMember(id="m1", name="Test", role="Dev", status="active")
        assert member.avatar_url is None


class TestCreateTeamMember:
    def test_factory_generates_uuid_id(self) -> None:
        member = create_team_member(name="Test", role="Dev", status="active")
        assert len(member.id) == 36  # UUID format

    def test_factory_accepts_explicit_id(self) -> None:
        member = create_team_member(name="Test", role="Dev", status="active", member_id="custom-id")
        assert member.id == "custom-id"

    def test_factory_sets_fields(self) -> None:
        member = create_team_member(name="Alice", role="PM", status="away", avatar_url="http://example.com/a.png")
        assert member.name == "Alice"
        assert member.role == "PM"
        assert member.status == "away"
        assert member.avatar_url == "http://example.com/a.png"


class TestCreateMoodEntry:
    def test_factory_generates_uuid_id(self) -> None:
        entry = create_mood_entry(member_id="m1", emoji="x", label="X")
        assert len(entry.id) == 36

    def test_factory_accepts_explicit_id(self) -> None:
        entry = create_mood_entry(member_id="m1", emoji="x", label="X", entry_id="custom")
        assert entry.id == "custom"

    def test_factory_sets_timestamp_to_utc_now(self) -> None:
        before = datetime.now(timezone.utc)
        entry = create_mood_entry(member_id="m1", emoji="x", label="X")
        after = datetime.now(timezone.utc)
        assert before <= entry.timestamp <= after
