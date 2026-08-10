import { getConversation } from "../../../lib/chat-data";

export async function GET(_request: Request, context: RouteContext<"/api/chats/[id]">) {
  const { id } = await context.params;
  const conversation = getConversation(id);

  if (!conversation) {
    return Response.json({ message: "Chat not found" }, { status: 404 });
  }

  return Response.json({ conversation });
}
