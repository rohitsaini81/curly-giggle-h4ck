# Project Context

Last updated: 2026-08-10

## Product intent

This repository contains a single-page Instagram Direct-style inbox. The original Create Next App template page was removed. The intended experience is a polished chat UI backed by dummy API calls, with the data layer designed so a real backend can replace it later.

The app uses Next.js Route Handlers as a backend-for-frontend proxy for the local Flask Instagram service:

1. Load the list of chats.
2. Load the complete conversation for a selected thread.
3. Send a text message to a selected thread.
4. Load an Instagram profile by username.

Instagram authentication and session persistence are handled by the adjacent Flask service. The Next.js server reads its base URL from `INSTAGRAM_API_URL` (default `http://127.0.0.1:5000`).

Local startup requires both services:

1. From `instagram/python/app`, run `python app.py`.
2. From `instagram/insta`, optionally copy `.env.example` to `.env.local`, then run `npm run dev`.

## Technology and version constraints

- Next.js `16.3.0` using the App Router
- React and React DOM `19.2.8`
- TypeScript
- Tailwind CSS `4` through `@tailwindcss/postcss`
- Bun is the declared package manager

This Next.js version can differ from older or remembered Next.js APIs. Before implementing framework-level changes, read the relevant bundled documentation under `node_modules/next/dist/docs/`. In particular:

- `01-app/01-getting-started/15-route-handlers.md`
- `01-app/01-getting-started/05-server-and-client-components.md`
- `01-app/01-getting-started/06-fetching-data.md`

Dynamic Route Handler parameters are asynchronous in this version. The conversation endpoint uses `RouteContext<"/api/chats/[id]">` and awaits `context.params`.

## Architecture

`app/page.tsx` is a small Server Component that renders `ChatApp`.

`app/components/chat-app.tsx` is the client boundary and owns:

- Loading the inbox with `GET /api/chats` on initial mount.
- Selecting the first returned chat by default.
- Loading a selected conversation with `GET /api/chats/{id}`.
- Cancelling stale conversation requests with `AbortController`.
- Inbox and conversation loading states.
- Mobile navigation between the chat list and the selected conversation.

Presentation is split into reusable components:

- `side-nav.tsx`: desktop Instagram-style navigation.
- `chat-list.tsx`: inbox header, loading skeletons, chat rows, unread and online states.
- `conversation-panel.tsx`: conversation header, profile summary, message bubbles, and composer shell.
- `avatar.tsx`: colored initial avatars and online indicator.
- `icons.tsx`: local inline SVG icon set; no icon package is required.

Shared API/UI types and Flask-to-UI mapping functions are in `app/lib/chat-data.ts`. `app/lib/instagram-api.ts` is the server-only Flask client. Route Handlers keep the Flask address private and translate its response into the existing UI contract.

## API contracts

### `GET /api/chats`

Response:

```json
{
  "chats": [
    {
      "id": "maya",
      "name": "Maya Chen",
      "username": "mayamakes",
      "avatar": "#e6a07b",
      "preview": "That place looks unreal 😍",
      "time": "2m",
      "unread": true,
      "online": true
    }
  ]
}
```

### `GET /api/chats/:id`

Successful response:

```json
{
  "conversation": {
    "id": "maya",
    "name": "Maya Chen",
    "username": "mayamakes",
    "avatar": "#e6a07b",
    "preview": "That place looks unreal 😍",
    "time": "2m",
    "unread": true,
    "online": true,
    "messages": [
      {
        "id": 1,
        "text": "Hey! How was your weekend?",
        "sentByMe": false,
        "time": "11:32 AM"
      }
    ]
  }
}
```

Missing IDs return status `404`:

```json
{ "message": "Chat not found" }
```

### `POST /api/chats/:id`

Accepts `{ "message": "Hello" }` and forwards it to Flask's thread-message endpoint.

### `GET /api/users/:username`

Returns `{ "profile": { ... } }` from Flask's Instagram profile endpoint.

## Responsive behavior

- Large desktop (`lg` and above): left Instagram navigation, chat list, and conversation panel.
- Tablet (`md`): chat list and conversation panel without the large navigation rail.
- Mobile: only the chat list is initially visible. Selecting a chat opens the conversation full-screen; the back control returns to the inbox.
- The app uses `h-dvh` and keeps each panel independently scrollable.

## Styling and assets

- Styling is predominantly Tailwind utility classes.
- `app/globals.css` contains the Tailwind import, reset-like global rules, and skeleton animation.
- Avatars are deterministic colored initials, so the UI has no remote image dependency.
- Icons are inline SVG components and therefore require no network or third-party library.
- The root uses a system font stack. The original `next/font/google` dependency was removed because production builds in offline/restricted environments could not download Geist.

## Hydration note

`app/layout.tsx` places `suppressHydrationWarning` on `<body>`. This handles browser extensions such as Grammarly injecting attributes like `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` before React hydrates. The observed warning came from extension-added DOM attributes, not non-deterministic application rendering.

## Verification history

- `bun run lint` passed after the chat implementation and hydration adjustment.
- A production build initially failed when `next/font/google` tried to fetch Geist without network access; the external font was removed.
- A later sandboxed Turbopack build reached CSS processing but could not bind an internal port due to sandbox restrictions. This was an environment permission failure, not a reported TypeScript or application error. A full `bun run build` should be run in an environment that allows Turbopack to create its internal process/port.

## Continuation rules

- Preserve the two-endpoint API split unless product requirements change.
- Update the shared types before changing an API response shape.
- Keep interactive state in the narrow client component boundary rather than converting the root layout or page to Client Components.
- Maintain loading, empty, error, and mobile navigation behavior when replacing dummy data with a real backend.
- Do not commit secrets or real Instagram credentials. Use environment variables for future backend credentials and document only variable names.
- Update this file when architecture, contracts, major UI behavior, commands, or known constraints change.
