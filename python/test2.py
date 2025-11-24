from instagrapi import Client
import json
import os

SESSION_FILE = "session.json"

def load_sessionid():
    if not os.path.exists(SESSION_FILE):
        raise FileNotFoundError("session.json not found!")

    with open(SESSION_FILE, "r") as f:
        data = json.load(f)

    # Extract correct sessionid
    return data["authorization_data"]["sessionid"]


def main():
    cl = Client()

    # Load settings
    cl.load_settings(SESSION_FILE)

    # Login using sessionid
    sessionid = load_sessionid()
    cl.login_by_sessionid(sessionid)

    print("\n=== Instagram DM Inbox ===\n")

    inbox = cl.direct_threads()

    for thread in inbox:
        print(f"Thread ID: {thread.id}")

        usernames = [u.username for u in thread.users]
        print(f"Users: {', '.join(usernames)}")

        # Fetch actual messages (works on all versions)
        messages = cl.direct_messages(thread.id)

        if messages:
            last = messages[0]  # newest message
            text = last.text if last.text else f"<{last.item_type}>"
            print("Last message:", text)
            print("At:", last.timestamp)
        else:
            print("Last message: <No messages>")

        print("-" * 50)

    print("\nDone.")


if __name__ == "__main__":
    main()

