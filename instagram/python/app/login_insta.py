"""Log in using credentials.txt and save app/session.json."""

from __future__ import annotations

from pathlib import Path

from instagrapi import Client


APP_DIR = Path(__file__).resolve().parent
CREDENTIALS_FILE = APP_DIR / "credentials.txt"
SESSION_FILE = APP_DIR / "session.json"


def read_credentials(path: str | Path = CREDENTIALS_FILE) -> tuple[str, str]:
    """Read either `username=...`/`password=...` or two non-empty lines."""
    credentials_path = Path(path)
    if not credentials_path.is_file():
        raise FileNotFoundError(f"Credentials file not found: {credentials_path}")

    lines = [
        line.strip()
        for line in credentials_path.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.lstrip().startswith("#")
    ]
    values: dict[str, str] = {}
    for line in lines:
        if "=" in line:
            key, value = line.split("=", 1)
            values[key.strip().lower()] = value.strip()

    if "username" in values and "password" in values:
        username, password = values["username"], values["password"]
    elif len(lines) == 2 and all("=" not in line for line in lines):
        username, password = lines
    else:
        raise ValueError(
            "credentials.txt must contain username=... and password=..., "
            "or username and password on separate lines"
        )

    if not username or not password:
        raise ValueError("Instagram username and password must not be empty")
    return username, password


def login() -> None:
    username, password = read_credentials()
    client = Client()
    client.login(username, password)
    client.dump_settings(SESSION_FILE)
    print(f"Login successful. Session saved to {SESSION_FILE}")


if __name__ == "__main__":
    login()

