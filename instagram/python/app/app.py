"""HTTP API exposing Instagram chat and profile operations."""

from __future__ import annotations

import os
from typing import Any, Callable

from flask import Flask, jsonify, request
from instagrapi.exceptions import ClientError

try:
    from .instagram import (
        InstagramSessionError,
        get_chat,
        get_client,
        get_user_profile,
        list_chats,
        send_message,
    )
except ImportError:  # Support running this file directly from the app directory.
    from instagram import (
        InstagramSessionError,
        get_chat,
        get_client,
        get_user_profile,
        list_chats,
        send_message,
    )


app = Flask(__name__)


def _positive_int(name: str, default: int = 20, maximum: int = 100) -> int:
    raw = request.args.get(name, str(default))
    try:
        value = int(raw)
    except ValueError as exc:
        raise ValueError(f"{name} must be an integer") from exc
    if value < 1 or value > maximum:
        raise ValueError(f"{name} must be between 1 and {maximum}")
    return value


def _run(operation: Callable[..., Any], *args: Any, **kwargs: Any):
    try:
        client = get_client()
        return jsonify({"ok": True, "data": operation(client, *args, **kwargs)})
    except (ValueError, InstagramSessionError) as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400
    except ClientError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 502


@app.get("/")
def health():
    return jsonify(
        {
            "ok": True,
            "service": "instagram-api",
            "endpoints": [
                "GET /chats",
                "GET /chats/<thread_id>",
                "GET /users/<username>",
                "POST /chats/<thread_id>/messages",
            ],
        }
    )


@app.get("/chats")
def chats():
    try:
        amount = _positive_int("amount")
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400
    return _run(list_chats, amount=amount)


@app.get("/chats/<thread_id>")
def chat(thread_id: str):
    try:
        amount = _positive_int("amount")
    except ValueError as exc:
        return jsonify({"ok": False, "error": str(exc)}), 400
    return _run(get_chat, thread_id, amount=amount)


@app.get("/users/<username>")
def user_profile(username: str):
    return _run(get_user_profile, username)


@app.post("/chats/<thread_id>/messages")
def create_message(thread_id: str):
    body = request.get_json(silent=True)
    if not isinstance(body, dict) or not isinstance(body.get("message"), str):
        return jsonify({"ok": False, "error": "JSON body must contain a message string"}), 400
    return _run(send_message, thread_id, body["message"])


if __name__ == "__main__":
    app.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "0") == "1",
    )
