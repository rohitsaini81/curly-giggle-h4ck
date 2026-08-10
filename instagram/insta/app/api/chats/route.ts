import { chats } from "../../lib/chat-data";

export async function GET() {
  return Response.json({ chats });
}
