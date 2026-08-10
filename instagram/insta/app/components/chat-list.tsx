import type { ChatSummary } from "../lib/chat-data";
import { Avatar } from "./avatar";
import { Icons } from "./icons";

type Props = {
  chats: ChatSummary[];
  activeId: string;
  loading: boolean;
  onSelect: (id: string) => void;
};

export function ChatList({ chats, activeId, loading, onSelect }: Props) {
  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-[#dbdbdb] bg-white md:w-[365px]">
      <header className="flex h-[74px] items-center justify-between px-6">
        <button className="flex items-center gap-2 text-xl font-bold tracking-tight">yourname <span className="text-xs">⌄</span></button>
        <button aria-label="New message" className="rounded-lg p-2 hover:bg-gray-100"><Icons.edit size={25} /></button>
      </header>
      <div className="flex items-center justify-between px-6 pb-3">
        <h1 className="font-bold">Messages</h1>
        <button className="text-sm font-semibold text-[#737373]">Requests</button>
      </div>
      <div className="overflow-y-auto pb-4">
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3 px-6 py-2.5"><div className="skeleton h-14 w-14 rounded-full bg-gray-200" /><div className="flex flex-1 flex-col justify-center gap-2"><div className="skeleton h-3 w-28 rounded bg-gray-200" /><div className="skeleton h-3 w-40 rounded bg-gray-100" /></div></div>
        )) : chats.map((chat) => (
          <button key={chat.id} onClick={() => onSelect(chat.id)} className={`flex w-full items-center gap-3 px-6 py-2.5 text-left transition hover:bg-[#fafafa] ${activeId === chat.id ? "bg-[#efefef]" : ""}`}>
            <Avatar name={chat.name} color={chat.avatar} online={chat.online} />
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-sm ${chat.unread ? "font-semibold" : "font-normal"}`}>{chat.name}</span>
              <span className={`block truncate text-sm ${chat.unread ? "font-semibold text-black" : "text-[#737373]"}`}>{chat.preview} <span className="font-normal text-[#737373]">· {chat.time}</span></span>
            </span>
            {chat.unread && <span className="h-2 w-2 rounded-full bg-[#0095f6]" />}
          </button>
        ))}
      </div>
    </aside>
  );
}
