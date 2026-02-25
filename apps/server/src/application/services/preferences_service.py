from datetime import datetime, timezone

from src.domain.models.user_preferences import UserPreferences, create_default_preferences
from src.domain.services.validation import validate_user_id, validate_username
from src.infrastructure.database.repositories.preferences_repo import PreferencesRepository


class PreferencesService:
    def __init__(self, repo: PreferencesRepository) -> None:
        self._repo = repo

    def get_preferences(self, user_id: str) -> UserPreferences:
        validated_id = validate_user_id(user_id)
        existing = self._repo.get_by_user_id(validated_id)
        if existing is not None:
            return existing
        default = create_default_preferences(validated_id)
        return self._repo.save(default)

    def update_preferences(
        self,
        user_id: str,
        username: str | None = None,
        dark_mode: bool | None = None,
    ) -> UserPreferences:
        current = self.get_preferences(user_id)
        updated = UserPreferences(
            user_id=current.user_id,
            username=validate_username(username) if username is not None else current.username,
            dark_mode=dark_mode if dark_mode is not None else current.dark_mode,
            created_at=current.created_at,
            updated_at=datetime.now(timezone.utc),
        )
        return self._repo.save(updated)

    def delete_preferences(self, user_id: str) -> bool:
        validated_id = validate_user_id(user_id)
        return self._repo.delete(validated_id)
