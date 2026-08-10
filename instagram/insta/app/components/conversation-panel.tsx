"use client";

import { useState } from "react";
import type { Conversation } from "../lib/chat-data";
import { Avatar } from "./avatar";
import { Icons } from "./icons";

export function ConversationPanel({ conversation, loading, onBack, onSend }: { conversation: Conversation | null; loading: boolean; onBack: () => void; onSend: (message: string) => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  async function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError("");
    try {
      await onSend(text);
      setMessage("");
    } catch (error) {
      setSendError(error instanceof Error ? error.message : "Could not send message");
    } finally {
      setSending(false);
    }
  }
  if (loading || !conversation) return <div className="hidden flex-1 flex-col bg-white md:flex"><div className="h-[74px] border-b border-[#dbdbdb]" /><div className="grid flex-1 place-items-center"><div className="skeleton h-8 w-40 rounded-full bg-gray-100" /></div></div>;

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-white">
      <header className="flex h-[74px] shrink-0 items-center border-b border-[#dbdbdb] px-4 sm:px-6">
        <button className="mr-3 text-2xl md:hidden" onClick={onBack} aria-label="Back to messages">‹</button>
        <Avatar name={conversation.name} color={conversation.avatar} size="sm" online={conversation.online} />
        <div className="ml-3 min-w-0 flex-1"><h2 className="truncate text-sm font-semibold">{conversation.name}</h2><p className="text-xs text-[#737373]">{conversation.online ? "Active now" : `@${conversation.username}`}</p></div>
        <div className="flex items-center gap-4 sm:gap-6"><button aria-label="Audio call"><Icons.phone /></button><button aria-label="Video call"><Icons.video /></button><button aria-label="Conversation info"><Icons.info /></button></div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-3 pt-8 sm:px-6">
        <div className="mb-8 flex flex-col items-center text-center">
          <Avatar name={conversation.name} color={conversation.avatar} size="lg" />
          <strong className="mt-3">{conversation.name}</strong><span className="text-sm text-[#737373]">{conversation.username} · Instagram</span>
          <button className="mt-4 rounded-lg bg-[#efefef] px-4 py-2 text-sm font-semibold hover:bg-[#dbdbdb]">View profile</button>
        </div>
        <div className="mt-auto flex flex-col gap-1.5">
          <p className="mb-3 text-center text-xs font-medium text-[#8e8e8e]">Today</p>
          {conversation.messages.map((message, index) => {
            const next = conversation.messages[index + 1];
            const lastInGroup = !next || next.sentByMe !== message.sentByMe;
            return (
              <div key={message.id} className={`group flex items-end gap-2 ${message.sentByMe ? "justify-end" : "justify-start"}`}>
                {!message.sentByMe && (lastInGroup ? <Avatar name={conversation.name} color={conversation.avatar} size="sm" /> : <span className="w-8" />)}
                <span title={message.time} className={`max-w-[72%] rounded-[22px] px-4 py-2.5 text-[15px] leading-5 ${message.sentByMe ? "bg-[#3797f0] text-white" : "bg-[#efefef] text-black"}`}>{message.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      {sendError && <p className="mx-6 mb-2 text-xs text-red-600">{sendError}</p>}
      <form className="mx-4 mb-5 flex h-11 shrink-0 items-center rounded-full border border-[#dbdbdb] px-3 sm:mx-5" onSubmit={submitMessage}>
        <button type="button" aria-label="Emoji"><Icons.smile /></button>
        <input value={message} onChange={(event) => setMessage(event.target.value)} disabled={sending} className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm outline-none placeholder:text-[#737373] disabled:opacity-60" placeholder="Message..." aria-label="Message" />
        {message.trim() ? <button type="submit" disabled={sending} className="text-sm font-semibold text-[#0095f6] disabled:opacity-50">{sending ? "Sending…" : "Send"}</button> : <div className="flex gap-3"><button type="button" aria-label="Add photo"><Icons.image /></button><button type="button" aria-label="Like"><Icons.heart /></button></div>}
      </form>
    </section>
  );
}
