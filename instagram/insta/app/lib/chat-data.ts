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
  id: number;
  text: string;
  sentByMe: boolean;
  time: string;
};

export type Conversation = ChatSummary & { messages: Message[] };

export const chats: ChatSummary[] = [
  { id: "maya", name: "Maya Chen", username: "mayamakes", avatar: "#e6a07b", preview: "That place looks unreal 😍", time: "2m", unread: true, online: true },
  { id: "alex", name: "Alex Rivera", username: "alex.r", avatar: "#78998a", preview: "You: See you tomorrow!", time: "1h", unread: false, online: true },
  { id: "noah", name: "Noah Williams", username: "noahw", avatar: "#b28168", preview: "Sent a reel by @filmdaily", time: "3h", unread: false, online: false },
  { id: "sophia", name: "Sophia Kim", username: "sophiakim", avatar: "#bf8a9e", preview: "Hahaha exactly 😂", time: "5h", unread: false, online: true },
  { id: "james", name: "James Wilson", username: "james.w", avatar: "#9b836d", preview: "Liked a message", time: "1d", unread: false, online: false },
  { id: "lena", name: "Lena Ortiz", username: "lenaortiz", avatar: "#7e8cad", preview: "You: I’ll send the photos", time: "2d", unread: false, online: false },
  { id: "sam", name: "Sam Taylor", username: "sam.t", avatar: "#a57373", preview: "Shared a post", time: "4d", unread: false, online: false },
];

const messageSets: Record<string, Message[]> = {
  maya: [
    { id: 1, text: "Hey! How was your weekend?", sentByMe: false, time: "11:32 AM" },
    { id: 2, text: "It was amazing! Finally made it up to the coast 🌊", sentByMe: true, time: "11:34 AM" },
    { id: 3, text: "No way, I’ve been wanting to go forever", sentByMe: false, time: "11:35 AM" },
    { id: 4, text: "You have to. The sunsets are next level.", sentByMe: true, time: "11:37 AM" },
    { id: 5, text: "That place looks unreal 😍", sentByMe: false, time: "11:38 AM" },
  ],
  alex: [
    { id: 1, text: "Are we still on for coffee?", sentByMe: false, time: "9:12 AM" },
    { id: 2, text: "Absolutely — same place at ten?", sentByMe: true, time: "9:15 AM" },
    { id: 3, text: "Perfect!", sentByMe: false, time: "9:16 AM" },
    { id: 4, text: "See you tomorrow!", sentByMe: true, time: "9:18 AM" },
  ],
};

export function getConversation(id: string): Conversation | undefined {
  const chat = chats.find((item) => item.id === id);
  if (!chat) return undefined;
  return {
    ...chat,
    messages: messageSets[id] ?? [
      { id: 1, text: chat.preview.replace(/^You: /, ""), sentByMe: chat.preview.startsWith("You:"), time: "Yesterday" },
    ],
  };
}
