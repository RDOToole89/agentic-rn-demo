"""API route tests — verify camelCase JSON, status codes, and error handling."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from src.api.main import app
from src.api.v1.dependencies import get_db
from src.infrastructure.database.connection import Base

import src.infrastructure.database.models.mood_entry_model  # noqa: F401
import src.infrastructure.database.models.preferences_model  # noqa: F401
import src.infrastructure.database.models.team_member_model  # noqa: F401

from src.seeds.team_seed import seed_team_data, MEMBER_IDS


@pytest.fixture
def test_db() -> Session:
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    TestSession = sessionmaker(bind=engine)
    session = TestSession()
    seed_team_data(session)
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def client(test_db: Session) -> TestClient:
    def _override_db():
        yield test_db

    app.dependency_overrides[get_db] = _override_db
    c = TestClient(app)
    yield c
    app.dependency_overrides.clear()


class TestListTeamMembers:
    def test_returns_200_with_list(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) == 8

    def test_response_has_camel_case_keys(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team")
        member = resp.json()[0]
        assert "avatarUrl" in member
        assert "currentMood" in member
        assert "moodHistory" in member
        # No snake_case keys
        assert "avatar_url" not in member
        assert "current_mood" not in member
        assert "mood_history" not in member

    def test_current_mood_has_camel_case_keys(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team")
        member = resp.json()[0]
        mood = member["currentMood"]
        assert "emoji" in mood
        assert "label" in mood
        assert "timestamp" in mood

    def test_member_has_expected_fields(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team")
        member = resp.json()[0]
        expected_keys = {"id", "name", "role", "avatarUrl", "status", "currentMood", "moodHistory"}
        assert set(member.keys()) == expected_keys


class TestGetTeamMember:
    def test_returns_200_for_existing_member(self, client: TestClient) -> None:
        resp = client.get(f"/api/v1/team/{MEMBER_IDS[0]}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Sarah Chen"

    def test_returns_404_for_nonexistent_member(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team/nonexistent")
        assert resp.status_code == 404
        assert "not found" in resp.json()["detail"].lower()

    def test_returns_400_for_invalid_id(self, client: TestClient) -> None:
        resp = client.get("/api/v1/team/bad@id")
        assert resp.status_code == 400

    def test_includes_full_mood_history(self, client: TestClient) -> None:
        resp = client.get(f"/api/v1/team/{MEMBER_IDS[0]}")
        data = resp.json()
        assert len(data["moodHistory"]) == 6  # Sarah Chen has 6 mood entries


class TestSubmitMood:
    def test_returns_201_on_success(self, client: TestClient) -> None:
        resp = client.post(
            f"/api/v1/team/{MEMBER_IDS[0]}/mood",
            json={"emoji": "🎉", "label": "Celebrating"},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["emoji"] == "🎉"
        assert data["label"] == "Celebrating"
        assert "timestamp" in data

    def test_updates_current_mood(self, client: TestClient) -> None:
        client.post(
            f"/api/v1/team/{MEMBER_IDS[0]}/mood",
            json={"emoji": "🎉", "label": "Celebrating"},
        )
        resp = client.get(f"/api/v1/team/{MEMBER_IDS[0]}")
        data = resp.json()
        assert data["currentMood"]["emoji"] == "🎉"
        assert len(data["moodHistory"]) == 7  # was 6, now 7

    def test_returns_400_for_nonexistent_member(self, client: TestClient) -> None:
        resp = client.post(
            "/api/v1/team/nonexistent/mood",
            json={"emoji": "😊", "label": "Happy"},
        )
        assert resp.status_code == 400
        assert "not found" in resp.json()["detail"].lower()

    def test_returns_400_for_invalid_emoji(self, client: TestClient) -> None:
        resp = client.post(
            f"/api/v1/team/{MEMBER_IDS[0]}/mood",
            json={"emoji": "x" * 11, "label": "Test"},
        )
        assert resp.status_code == 400

    def test_returns_400_for_empty_label(self, client: TestClient) -> None:
        resp = client.post(
            f"/api/v1/team/{MEMBER_IDS[0]}/mood",
            json={"emoji": "😊", "label": ""},
        )
        assert resp.status_code == 400
