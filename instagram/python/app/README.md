# Instagram Flask API

1. Edit `credentials.txt`.
2. Create the session with `python login_insta.py`.
3. Start the API with `python app.py`.

Endpoints:

- `GET /chats?amount=20`
- `GET /chats/<thread_id>?amount=20`
- `GET /users/<username>`
- `POST /chats/<thread_id>/messages` with JSON `{"message": "Hello"}`

The API reads `session.json` for every request, so the server does not need to
store a password or share one Instagram client across concurrent requests.

Responses use a consistent JSON envelope:

```json
{"ok": true, "data": {}}
```

Use `curl -s localhost:5000/chats | python -m json.tool` to pretty-print JSON
in a terminal.
