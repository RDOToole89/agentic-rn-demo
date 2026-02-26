from src.domain.models.mood_entry import MoodEntry, create_mood_entry
from src.domain.models.team_member import TeamMember
from src.domain.services.team_validation import (
    validate_member_id,
    validate_mood_emoji,
    validate_mood_label,
)
from src.infrastructure.database.repositories.team_repo import TeamRepository


class TeamService:
    def __init__(self, repo: TeamRepository) -> None:
        self._repo = repo

    def get_all_members(self) -> list[TeamMember]:
        return self._repo.get_all()

    def get_member(self, member_id: str) -> TeamMember | None:
        validated_id = validate_member_id(member_id)
        return self._repo.get_by_id(validated_id)

    def submit_mood(self, member_id: str, emoji: str, label: str) -> MoodEntry:
        validated_id = validate_member_id(member_id)
        validated_emoji = validate_mood_emoji(emoji)
        validated_label = validate_mood_label(label)

        member = self._repo.get_by_id(validated_id)
        if member is None:
            raise ValueError(f"Team member '{validated_id}' not found")

        entry = create_mood_entry(
            member_id=validated_id,
            emoji=validated_emoji,
            label=validated_label,
        )
        return self._repo.add_mood_entry(entry)
