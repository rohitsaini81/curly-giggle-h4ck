import type { InstagramChat } from "../../../lib/chat-data";
import { toConversation } from "../../../lib/chat-data";
import { InstagramApiError, instagramRequest } from "../../../lib/instagram-api";

function errorResponse(error: unknown) {
  const apiError = error instanceof InstagramApiError ? error : new InstagramApiError("Instagram request failed");
  return Response.json({ message: apiError.message }, { status: apiError.status });
}

export async function GET(request: Request, context: RouteContext<"/api/chats/[id]">) {
  const { id } = await context.params;
  const amount = new URL(request.url).searchParams.get("amount") ?? "50";
  try {
    const chat = await instagramRequest<InstagramChat>(
      `/chats/${encodeURIComponent(id)}?amount=${encodeURIComponent(amount)}`,
    );
    return Response.json({ conversation: toConversation(chat) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request, context: RouteContext<"/api/chats/[id]">) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    return Response.json({ message: "Message must not be empty" }, { status: 400 });
  }
  try {
    const result = await instagramRequest(`/chats/${encodeURIComponent(id)}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: body.message.trim() }),
    });
    return Response.json({ result });
  } catch (error) {
    return errorResponse(error);
  }
}
