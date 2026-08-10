import type { InstagramChat } from "../../lib/chat-data";
import { toChatSummary } from "../../lib/chat-data";
import { InstagramApiError, instagramRequest } from "../../lib/instagram-api";

export async function GET(request: Request) {
  const amount = new URL(request.url).searchParams.get("amount") ?? "20";
  try {
    const chats = await instagramRequest<InstagramChat[]>(`/chats?amount=${encodeURIComponent(amount)}`);
    return Response.json({ chats: chats.map(toChatSummary) });
  } catch (error) {
    const apiError = error instanceof InstagramApiError ? error : new InstagramApiError("Could not load chats");
    return Response.json({ message: apiError.message }, { status: apiError.status });
  }
}
