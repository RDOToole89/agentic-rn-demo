from sqlalchemy.orm import Session

from src.domain.models.user_preferences import UserPreferences
from src.infrastructure.database.mappers.preferences_mapper import to_domain, to_model
from src.infrastructure.database.models.preferences_model import PreferencesModel


class PreferencesRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_user_id(self, user_id: str) -> UserPreferences | None:
        model = self._db.get(PreferencesModel, user_id)
        if model is None:
            return None
        return to_domain(model)

    def save(self, entity: UserPreferences) -> UserPreferences:
        model = self._db.get(PreferencesModel, entity.user_id)
        if model is None:
            model = to_model(entity)
            self._db.add(model)
        else:
            model.username = entity.username
            model.dark_mode = entity.dark_mode
            model.updated_at = entity.updated_at
        self._db.commit()
        self._db.refresh(model)
        return to_domain(model)

    def delete(self, user_id: str) -> bool:
        model = self._db.get(PreferencesModel, user_id)
        if model is None:
            return False
        self._db.delete(model)
        self._db.commit()
        return True
