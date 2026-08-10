"""Small service layer around instagrapi's direct-message API."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from pathlib import Path
from typing import Any

from instagrapi import Client


APP_DIR = Path(__file__).resolve().parent
SESSION_FILE = APP_DIR / "session.json"


class InstagramSessionError(RuntimeError):
    """Raised when a usable Instagram session cannot be loaded."""


def _json_safe(value: Any) -> Any:
    """Convert instagrapi/Pydantic values into Flask-serializable values."""
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, Path):
        return str(value)
    if isinstance(value, dict):
        return {str(key): _json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(item) for item in value]
    if hasattr(value, "model_dump"):
        return _json_safe(value.model_dump())
    if hasattr(value, "dict"):
        return _json_safe(value.dict())
    return str(value)


def _value(obj: Any, name: str, default: Any = None) -> Any:
    """Read a field from either an instagrapi model or a dictionary."""
    if isinstance(obj, dict):
        return obj.get(name, default)
    return getattr(obj, name, default)


def _user_summary(user: Any) -> dict[str, Any]:
    return {
        "id": str(_value(user, "pk", _value(user, "id", ""))),
        "username": _value(user, "username", ""),
        "full_name": _value(user, "full_name", ""),
        "profile_pic_url": _json_safe(_value(user, "profile_pic_url")),
        "is_verified": bool(_value(user, "is_verified", False)),
    }


def _message_summary(message: Any) -> dict[str, Any]:
    """Keep useful message fields while excluding enormous raw media payloads."""
    return {
        "id": str(_value(message, "id", "")),
        "sender_id": str(_value(message, "user_id", "")),
        "type": _json_safe(_value(message, "item_type")),
        "text": _value(message, "text"),
        "timestamp": _json_safe(_value(message, "timestamp")),
        "is_sent_by_viewer": bool(_value(message, "is_sent_by_viewer", False)),
    }


def _thread_summary(thread: Any, include_messages: bool = False) -> dict[str, Any]:
    users = [_user_summary(user) for user in (_value(thread, "users", []) or [])]
    messages = _value(thread, "messages", _value(thread, "items", [])) or []
    result = {
        "id": str(_value(thread, "id", "")),
        "title": _value(thread, "thread_title", _value(thread, "title")),
        "is_group": bool(_value(thread, "is_group", False)),
        "users": users,
        "last_activity_at": _json_safe(_value(thread, "last_activity_at")),
        "last_message": _message_summary(messages[0]) if messages else None,
    }
    if include_messages:
        result["messages"] = [_message_summary(message) for message in messages]
    return result


def get_client(session_file: str | Path = SESSION_FILE) -> Client:
    """Create a client from an existing session.json file."""
    session_path = Path(session_file)
    if not session_path.is_file():
        raise InstagramSessionError(
            f"Session file not found: {session_path}. Run login_insta.py first."
        )

    client = Client()
    try:
        client.load_settings(session_path)
    except Exception as exc:
        raise InstagramSessionError(f"Could not load Instagram session: {exc}") from exc
    return client


def list_chats(client: Client, amount: int = 20) -> list[dict[str, Any]]:
    """Return the authenticated account's direct-message threads."""
    threads = client.direct_threads(amount=amount)
    return [_thread_summary(thread) for thread in threads]


def get_chat(client: Client, thread_id: str, amount: int = 20) -> dict[str, Any]:
    """Return one direct-message thread, including its recent messages."""
    thread = client.direct_thread(thread_id, amount=amount)
    return _thread_summary(thread, include_messages=True)


def get_user_profile(client: Client, username: str) -> dict[str, Any]:
    """Return public profile information for a username."""
    user_id = client.user_id_from_username(username)
    user = client.user_info(user_id)
    result = _user_summary(user)
    result.update(
        {
            "biography": _value(user, "biography", ""),
            "external_url": _value(user, "external_url"),
            "follower_count": _value(user, "follower_count", 0),
            "following_count": _value(user, "following_count", 0),
            "media_count": _value(user, "media_count", 0),
            "is_private": bool(_value(user, "is_private", False)),
        }
    )
    return _json_safe(result)


def send_message(client: Client, thread_id: str, message: str) -> dict[str, Any]:
    """Send a text message to an existing direct-message thread."""
    text = message.strip()
    if not text:
        raise ValueError("message must not be empty")
    result = client.direct_send(text, thread_ids=[thread_id])
    return {
        "thread_id": str(thread_id),
        "message": _message_summary(result),
    }
