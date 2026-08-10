# Instagram Direct UI

A responsive Instagram-style chat interface built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. The app currently uses local dummy data exposed through two Route Handler APIs.

## Run locally

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
bun run lint
bun run build
```

## API

- `GET /api/chats` returns chat summaries for the inbox.
- `GET /api/chats/:id` returns one user and their messages.
- An unknown chat ID returns HTTP `404` with `{ "message": "Chat not found" }`.

Dummy records and shared TypeScript types live in `app/lib/chat-data.ts`.

## Project structure

```text
app/
├── api/chats/                 # Dummy chat API routes
├── components/                # Chat UI components
├── lib/chat-data.ts           # Shared types and dummy data
├── globals.css                # Tailwind import and global styles
├── layout.tsx                 # Metadata and root document
└── page.tsx                   # Single application page
```

See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for implementation details and continuation notes.
