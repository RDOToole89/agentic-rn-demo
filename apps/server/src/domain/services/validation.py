import re


def validate_username(username: str) -> str:
    stripped = username.strip()
    if not stripped:
        raise ValueError("Username must not be empty")
    if len(stripped) > 50:
        raise ValueError("Username must be 50 characters or fewer")
    return stripped


def validate_user_id(user_id: str) -> str:
    if not re.match(r"^[a-zA-Z0-9_-]+$", user_id):
        raise ValueError(
            "User ID must contain only alphanumeric characters, hyphens, and underscores"
        )
    if len(user_id) > 100:
        raise ValueError("User ID must be 100 characters or fewer")
    return user_id
