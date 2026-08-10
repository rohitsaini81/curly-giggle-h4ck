export type ChatSummary = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  online: boolean;
};

export type Message = {
  id: string;
  text: string;
  sentByMe: boolean;
  time: string;
};

export type Conversation = ChatSummary & { messages: Message[] };

export type InstagramUser = {
  id: string;
  username: string;
  full_name: string;
  profile_pic_url: string | null;
  is_verified: boolean;
};

export type InstagramMessage = {
  id: string;
  sender_id: string;
  type: string | null;
  text: string | null;
  timestamp: string | null;
  is_sent_by_viewer: boolean;
};

export type InstagramChat = {
  id: string;
  title: string | null;
  is_group: boolean;
  users: InstagramUser[];
  last_activity_at: string | null;
  last_message: InstagramMessage | null;
  messages?: InstagramMessage[];
};

export type InstagramEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function formatRelativeTime(value: string | null): string {
  if (!value) return "";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function formatMessageTime(value: string | null): string {
  if (!value) return "";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return "";
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(timestamp);
}

function messageText(message: InstagramMessage | null): string {
  if (!message) return "No messages yet";
  if (message.text) return message.text;
  return message.type ? `Sent ${message.type.replaceAll("_", " ")}` : "Sent a message";
}

export function toChatSummary(chat: InstagramChat): ChatSummary {
  const primaryUser = chat.users[0];
  const name = chat.title || primaryUser?.full_name || primaryUser?.username || "Instagram user";
  const preview = messageText(chat.last_message);
  return {
    id: chat.id,
    name,
    username: primaryUser?.username ?? "",
    avatar: primaryUser?.profile_pic_url ?? "#8a769d",
    preview: chat.last_message?.is_sent_by_viewer ? `You: ${preview}` : preview,
    time: formatRelativeTime(chat.last_activity_at),
    unread: false,
    online: false,
  };
}

export function toConversation(chat: InstagramChat): Conversation {
  return {
    ...toChatSummary(chat),
    messages: (chat.messages ?? []).slice().reverse().map((message) => ({
      id: message.id,
      text: messageText(message),
      sentByMe: message.is_sent_by_viewer,
      time: formatMessageTime(message.timestamp),
    })),
  };
}
