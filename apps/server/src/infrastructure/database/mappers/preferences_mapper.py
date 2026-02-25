from src.domain.models.user_preferences import UserPreferences
from src.infrastructure.database.models.preferences_model import PreferencesModel


def to_domain(model: PreferencesModel) -> UserPreferences:
    return UserPreferences(
        user_id=model.user_id,
        username=model.username,
        dark_mode=model.dark_mode,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )


def to_model(entity: UserPreferences) -> PreferencesModel:
    return PreferencesModel(
        user_id=entity.user_id,
        username=entity.username,
        dark_mode=entity.dark_mode,
        created_at=entity.created_at,
        updated_at=entity.updated_at,
    )
