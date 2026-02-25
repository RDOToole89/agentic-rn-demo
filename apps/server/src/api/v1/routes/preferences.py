from fastapi import APIRouter, Depends, HTTPException

from src.api.v1.dependencies import get_db, get_preferences_repo, get_preferences_service
from src.api.v1.schemas.preference_schemas import PreferenceResponse, PreferenceUpdate
from src.application.services.preferences_service import PreferencesService

router = APIRouter(prefix="/api/v1/preferences", tags=["preferences"])


def _get_service(
    db=Depends(get_db),
) -> PreferencesService:
    repo = get_preferences_repo(db)
    return get_preferences_service(repo)


@router.get("/{user_id}", response_model=PreferenceResponse)
def get_preferences(
    user_id: str,
    service: PreferencesService = Depends(_get_service),
) -> PreferenceResponse:
    try:
        prefs = service.get_preferences(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return PreferenceResponse.model_validate(prefs)


@router.put("/{user_id}", response_model=PreferenceResponse)
def update_preferences(
    user_id: str,
    body: PreferenceUpdate,
    service: PreferencesService = Depends(_get_service),
) -> PreferenceResponse:
    try:
        prefs = service.update_preferences(
            user_id=user_id,
            username=body.username,
            dark_mode=body.dark_mode,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return PreferenceResponse.model_validate(prefs)
