"use client";

import { useEffect, useState } from "react";
import type { ChatSummary, Conversation } from "../lib/chat-data";
import { ChatList } from "./chat-list";
import { ConversationPanel } from "./conversation-panel";
import { SideNav } from "./side-nav";

export function ChatApp() {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [activeId, setActiveId] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileConversation, setMobileConversation] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadChats() {
      try {
        setError("");
        const response = await fetch("/api/chats");
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message ?? "Could not load chats");
        }
        const data: { chats: ChatSummary[] } = await response.json();
        if (!ignore) {
          setChats(data.chats);
          setActiveId(data.chats[0]?.id ?? "");
        }
      } catch (error) {
        if (!ignore) setError(error instanceof Error ? error.message : "Could not load chats");
      } finally {
        if (!ignore) setListLoading(false);
      }
    }
    loadChats();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const controller = new AbortController();
    async function loadConversation() {
      setChatLoading(true);
      try {
        const response = await fetch(`/api/chats/${activeId}`, { signal: controller.signal });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message ?? "Could not load conversation");
        }
        const data: { conversation: Conversation } = await response.json();
        setConversation(data.conversation);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setError(error instanceof Error ? error.message : "Could not load conversation");
        }
      } finally {
        if (!controller.signal.aborted) setChatLoading(false);
      }
    }
    loadConversation();
    return () => controller.abort();
  }, [activeId]);

  function selectChat(id: string) {
    setActiveId(id);
    setMobileConversation(true);
  }

  async function sendMessage(message: string) {
    if (!activeId || !conversation) return;
    const optimisticMessage = { id: `pending-${Date.now()}`, text: message, sentByMe: true, time: "now" };
    setConversation({ ...conversation, messages: [...conversation.messages, optimisticMessage] });
    const response = await fetch(`/api/chats/${activeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setConversation(conversation);
      throw new Error(body?.message ?? "Could not send message");
    }
  }

  return (
    <main className="flex h-dvh overflow-hidden bg-white">
      <SideNav />
      <div className={`h-full w-full md:block md:w-auto ${mobileConversation ? "hidden" : "block"}`}><ChatList chats={chats} activeId={activeId} loading={listLoading} error={error} onSelect={selectChat} /></div>
      <div className={`h-full min-w-0 flex-1 md:block ${mobileConversation ? "block" : "hidden"}`}><ConversationPanel conversation={conversation} loading={chatLoading} onBack={() => setMobileConversation(false)} onSend={sendMessage} /></div>
    </main>
  );
}
