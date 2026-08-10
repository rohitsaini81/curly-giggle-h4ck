import "server-only";

import type { InstagramEnvelope } from "./chat-data";

const baseUrl = (process.env.INSTAGRAM_API_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");

export class InstagramApiError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
  }
}

export async function instagramRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { ...init, cache: "no-store" });
  } catch {
    throw new InstagramApiError("Instagram service is unavailable");
  }

  const payload = (await response.json().catch(() => null)) as InstagramEnvelope<T> | null;
  if (!response.ok || !payload?.ok) {
    const message = payload && !payload.ok ? payload.error : `Instagram service returned ${response.status}`;
    throw new InstagramApiError(message, response.status || 502);
  }
  return payload.data;
}
