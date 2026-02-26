from fastapi import APIRouter, Depends, HTTPException

from src.api.v1.dependencies import get_db, get_team_repo, get_team_service
from src.api.v1.schemas.team_schemas import (
    MoodEntryResponse,
    SubmitMoodRequest,
    TeamMemberResponse,
)
from src.application.services.team_service import TeamService

router = APIRouter(prefix="/api/v1/team", tags=["team"])


def _get_service(db=Depends(get_db)) -> TeamService:
    repo = get_team_repo(db)
    return get_team_service(repo)


@router.get("", response_model=list[TeamMemberResponse])
def list_team_members(
    service: TeamService = Depends(_get_service),
) -> list[TeamMemberResponse]:
    members = service.get_all_members()
    return [TeamMemberResponse.model_validate(m) for m in members]


@router.get("/{id}", response_model=TeamMemberResponse)
def get_team_member(
    id: str,
    service: TeamService = Depends(_get_service),
) -> TeamMemberResponse:
    try:
        member = service.get_member(id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    if member is None:
        raise HTTPException(status_code=404, detail="Team member not found")
    return TeamMemberResponse.model_validate(member)


@router.post("/{id}/mood", response_model=MoodEntryResponse, status_code=201)
def submit_mood(
    id: str,
    body: SubmitMoodRequest,
    service: TeamService = Depends(_get_service),
) -> MoodEntryResponse:
    try:
        entry = service.submit_mood(id, body.emoji, body.label)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return MoodEntryResponse.model_validate(entry)
