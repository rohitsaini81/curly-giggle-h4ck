
import os
from instagrapi import Client
import json


SESSION_FILE = "session.json"

def load_sessionid():
    if not os.path.exists(SESSION_FILE):
        raise FileNotFoundError("session.json not found!")

    with open(SESSION_FILE, "r") as f:
        data = json.load(f)

    return data["authorization_data"]["sessionid"]


def main():
    cl = Client()

    # Load settings + login
    cl.load_settings(SESSION_FILE)
    sessionid = load_sessionid()
    cl.login_by_sessionid(sessionid)

    print("\n=== Instagram DM Inbox ===\n")

    inbox = cl.direct_threads()

    threads = []  # store for selection menu

    for idx, thread in enumerate(inbox):
        usernames = [u.username for u in thread.users]

        # Fetch messages
        messages = cl.direct_messages(thread.id)
        last_msg = messages[0].text if messages else "<No messages>"

        print(f"{idx}. Users: {', '.join(usernames)}")
        print(f"   Last: {last_msg}")
        print("-" * 50)

        threads.append(thread)

    # Choose thread
    choice = int(input("\nSelect chat number to send a message: "))
    thread = threads[choice]

    message = input("Enter message: ")

    # Send the messages
    cl.direct_thread_send(message, thread.id)

    print("\nMessage sent!")

    print("\nMessage sent successfully!")


if __name__ == "__main__":
    main()

