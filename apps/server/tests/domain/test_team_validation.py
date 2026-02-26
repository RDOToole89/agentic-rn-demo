import pytest

from src.domain.services.team_validation import (
    validate_member_id,
    validate_mood_emoji,
    validate_mood_label,
    validate_status,
)


class TestValidateMemberId:
    def test_valid_id(self) -> None:
        assert validate_member_id("abc-123_XYZ") == "abc-123_XYZ"

    def test_strips_whitespace(self) -> None:
        assert validate_member_id("  abc  ") == "abc"

    def test_empty_raises(self) -> None:
        with pytest.raises(ValueError, match="must not be empty"):
            validate_member_id("")

    def test_whitespace_only_raises(self) -> None:
        with pytest.raises(ValueError, match="must not be empty"):
            validate_member_id("   ")

    def test_special_chars_raises(self) -> None:
        with pytest.raises(ValueError, match="alphanumeric"):
            validate_member_id("abc@def")

    def test_too_long_raises(self) -> None:
        with pytest.raises(ValueError, match="100 characters"):
            validate_member_id("a" * 101)


class TestValidateMoodEmoji:
    def test_valid_emoji(self) -> None:
        assert validate_mood_emoji("😊") == "😊"

    def test_strips_whitespace(self) -> None:
        assert validate_mood_emoji(" 🔥 ") == "🔥"

    def test_empty_raises(self) -> None:
        with pytest.raises(ValueError, match="must not be empty"):
            validate_mood_emoji("")

    def test_too_long_raises(self) -> None:
        with pytest.raises(ValueError, match="10 characters"):
            validate_mood_emoji("x" * 11)


class TestValidateMoodLabel:
    def test_valid_label(self) -> None:
        assert validate_mood_label("Happy") == "Happy"

    def test_strips_whitespace(self) -> None:
        assert validate_mood_label("  Fired Up  ") == "Fired Up"

    def test_empty_raises(self) -> None:
        with pytest.raises(ValueError, match="must not be empty"):
            validate_mood_label("")

    def test_too_long_raises(self) -> None:
        with pytest.raises(ValueError, match="50 characters"):
            validate_mood_label("x" * 51)


class TestValidateStatus:
    @pytest.mark.parametrize("status", ["active", "away", "offline"])
    def test_valid_statuses(self, status: str) -> None:
        assert validate_status(status) == status

    def test_case_insensitive(self) -> None:
        assert validate_status("ACTIVE") == "active"

    def test_strips_whitespace(self) -> None:
        assert validate_status("  away  ") == "away"

    def test_invalid_raises(self) -> None:
        with pytest.raises(ValueError, match="must be one of"):
            validate_status("busy")
