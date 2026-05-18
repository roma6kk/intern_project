'use client';

import { useState, useEffect, useRef, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatList from '@/widgets/chat/ChatList';
import ChatWindow from '@/widgets/chat/ChatWindow';
import { getOnlineUsers, getUserChats } from '@/entities/chat';
import type { Chat } from '@/entities/chat';
import type { Message } from '@/entities/chat';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/entities/session';
import CreateChatModal from '@/widgets/chat/CreateChatModal';
import { currentChatIdRef } from '@/shared/lib/current-chat-id';
import { useSocket } from '@/entities/session';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

const EMPTY_ONLINE_USER_IDS = new Set<string>();

function normalizeMessage(payload: unknown): Message | null {
  if (!payload || typeof payload !== 'object') return null;
  const m = payload as Record<string, unknown>;
  const chatId = (m.chatId as string) ?? (m.chat_id as string);
  if (!chatId) return null;
  const senderId = (m.senderId as string) ?? (m.sender_id as string);
  return { ...m, chatId, senderId } as Message;
}

function ChatPageContent() {
  const { user } = useAuth();
  const socket = useSocket();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(() => new Set());
  const visibleOnlineUserIds = user ? onlineUserIds : EMPTY_ONLINE_USER_IDS;
  const setChatsRef = useRef(setChats);
  const updateChatPreview = useCallback((chatId: string, message: Message | null) => {
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.id === chatId);
      if (idx === -1) return prev;
      const chat = prev[idx];
      const updated: Chat = { ...chat, messages: message ? [message] : [] };
      return [updated, ...prev.filter((_, i) => i !== idx)];
    });
  }, []);
  useEffect(() => {
    setChatsRef.current = setChats;
  }, [setChats]);

  useEffect(() => {
    if (user) {
      getUserChats()
        .then(setChats)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    const refreshOnlineUsers = () => {
      getOnlineUsers()
        .then((ids) => {
          if (cancelled) return;
          setOnlineUserIds(new Set(ids));
        })
        .catch(() => {
          if (cancelled) return;
          setOnlineUserIds(new Set());
        });
    };

    if (!user) return;

    refreshOnlineUsers();
    const intervalId = window.setInterval(refreshOnlineUsers, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [user]);

  const chatIdFromUrl = searchParams.get('chatId');
  const selectedChatId = useMemo(() => {
    if (!chatIdFromUrl || chats.length === 0) return null;
    return chats.some((c) => c.id === chatIdFromUrl) ? chatIdFromUrl : null;
  }, [chatIdFromUrl, chats]);

  const selectChat = useCallback(
    (chatId: string) => {
      router.replace(`/chat?chatId=${encodeURIComponent(chatId)}`, { scroll: false });
    },
    [router]
  );

  const clearChatSelection = useCallback(() => {
    router.replace('/chat', { scroll: false });
  }, [router]);

  useEffect(() => {
    currentChatIdRef.current = selectedChatId;
    if (selectedChatId && user) {
      getUserChats().then(setChats);
    }
  }, [selectedChatId, user]);

  useEffect(() => {
    return () => {
      currentChatIdRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (payload: unknown) => {
      const message = normalizeMessage(payload);
      if (!message) return;
      setChatsRef.current((prev) => {
        const idx = prev.findIndex((c) => c.id === message.chatId);
        if (idx === -1) return prev;
        const chat = prev[idx];
        const updated: Chat = { ...chat, messages: [message] };
        return [updated, ...prev.filter((_, i) => i !== idx)];
      });
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== 'visible' || !user) return;
      getUserChats().then(setChats);
      getOnlineUsers().then((ids) => setOnlineUserIds(new Set(ids)));
      if (socket && !socket.connected) socket.connect();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user, socket]);

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const chatViewportClass = 'h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)]';

  const content = isLoading ? (
    <div className={cn('flex items-center justify-center p-4 bg-transparent overflow-hidden', chatViewportClass)}>
      <div className={cn(surface.card, 'rounded-3xl p-8 flex flex-col items-center gap-4 max-w-sm w-full border border-border/70 shadow-[0_20px_50px_-30px_var(--overlay)]')}>
        <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground font-medium">Loading chats...</p>
      </div>
    </div>
  ) : (
    <div className={cn('overflow-hidden px-1 py-2 sm:px-2 sm:py-3', chatViewportClass)}>
      <div className={cn(surface.card, animations.slideUp, 'relative flex h-full min-h-0 overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 shadow-[0_30px_100px_-45px_var(--overlay)] innogram-glow-edge')}>
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.12),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(14,165,233,0.1),transparent_42%)]" />
      <div className={`relative w-full md:w-1/3 min-h-0 border-r border-border/60 ${selectedChatId ? 'hidden md:block' : 'block'}`}>
        <div className="h-full min-h-0 flex flex-col">
          <div className="p-3 border-b border-border/60 flex justify-between bg-background/55 backdrop-blur-sm">
            <div className="flex items-center font-semibold text-lg text-foreground ml-3">
            Чаты
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-xl hover:opacity-90 transition shadow-sm">
              <MessageSquarePlus size={18} />
              Новый чат
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={selectChat}
              onlineUserIds={visibleOnlineUserIds}
            />
          </div>
        </div>
      </div>

      <div className={`relative w-full md:w-2/3 min-h-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.34),rgba(255,255,255,0.08))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] ${!selectedChatId ? 'hidden md:block' : 'block'}`}>
        {selectedChat ? (
          <div className="h-full min-h-0 flex flex-col">
            <ChatWindow
              chat={selectedChat}
              onlineUserIds={visibleOnlineUserIds}
              onBack={clearChatSelection}
              onLatestMessage={updateChatPreview}
              onMessagesRead={() => {
                getUserChats().then(setChats);
              }}
              onChatUpdated={(updatedChat) => {
                setChats(prev => prev.map(c => (c.id === updatedChat.id ? updatedChat : c)));
              }}
              onLeftChat={() => {
                getUserChats().then(setChats);
                clearChatSelection();
              }}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <MessageSquarePlus size={64} className="mb-4 opacity-40" />
            <p className="text-lg font-medium">Выберите чат, чтобы начать общение</p>
          </div>
        )}
      </div>
      <CreateChatModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(chat) => {
          setChats(prev => [chat, ...prev]);
          selectChat(chat.id);
        }}
      />
      </div>
    </div>
  );
  return content;
}

export default function ChatPage() {
  const chatViewportClass = 'h-[calc(100dvh-5rem)] max-h-[calc(100dvh-5rem)]';

  return (
    <div className={cn('overflow-hidden', chatViewportClass)}>
      <Suspense
      fallback={
        <div className={cn('flex items-center justify-center p-4 bg-muted/50 overflow-hidden', chatViewportClass)}>
          <div className="bg-card rounded-lg shadow-sm border border-border p-8 flex flex-col items-center gap-4 max-w-sm w-full">
            <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground font-medium">Loading chats...</p>
          </div>
        </div>
      }
    >
      <ChatPageContent />
      </Suspense>
    </div>
  );
}