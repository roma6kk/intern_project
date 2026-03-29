'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  MessageSquare,
  PlusSquare,
  Heart,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/entities/session';
import { useTheme } from '@/application/providers/theme-provider';
import CreatePostModal from '@/widgets/create-post-modal';
import SearchModal from '@/widgets/search-modal';
import api from '@/shared/api';
import type { Notification } from '@/entities/notification';
import { useSocketNotifications } from '@/shared/lib/use-socket-notifications';
import { useSocket } from '@/entities/session';
import { getUserChats } from '@/entities/chat';
import { currentChatIdRef } from '@/shared/lib/current-chat-id';
import type { Chat, Message } from '@/entities/chat';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

function normalizeMessage(payload: unknown): Message | null {
  if (!payload || typeof payload !== 'object') return null;
  const m = payload as Record<string, unknown>;
  const chatId = (m.chatId as string) ?? (m.chat_id as string);
  if (!chatId) return null;
  const senderId = (m.senderId as string) ?? (m.sender_id as string);
  return { ...m, chatId, senderId } as Message;
}

const navBtn =
  'relative flex p-2.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200';

function notificationLooksUnread(n: Notification & { is_read?: boolean }): boolean {
  const read = n.isRead ?? n.is_read;
  return read !== true;
}

/** Preview row from GET /chats omits top-level senderId; only nested sender.id is present. */
function lastMessageIsUnreadIncomingForUser(
  lastMessage: Message & { sender_id?: string; sender?: { id?: string } | null },
  myUserId: string
): boolean {
  if (lastMessage.isRead) return false;
  const senderId =
    lastMessage.senderId ??
    lastMessage.sender_id ??
    lastMessage.sender?.id;
  if (!senderId) return false;
  return senderId !== myUserId;
}

export function TopNav() {
  const pathnameValue = usePathname();
  const pathname = pathnameValue ?? '';
  const { user, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const socket = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const syncInteractionsBadge = useCallback(async () => {
    if (!user?.id) {
      setHasUnread(false);
      return;
    }
    try {
      const [notifRes, followsRes] = await Promise.all([
        api.get<{ data: Notification[] }>('/notification/me?limit=100'),
        api.get<unknown[]>('/follows/requests/me'),
      ]);
      const items = Array.isArray(notifRes.data?.data) ? notifRes.data.data : [];
      const hasUnreadNotif = items.some(notificationLooksUnread);
      const hasPendingFollowRequests =
        Array.isArray(followsRes.data) && followsRes.data.length > 0;
      setHasUnread(hasUnreadNotif || hasPendingFollowRequests);
    } catch {
      setHasUnread(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset badge when logged out
      setHasUnread(false);
      return;
    }

    void syncInteractionsBadge();

    const handleFocus = () => {
      void syncInteractionsBadge();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void syncInteractionsBadge();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, pathname, syncInteractionsBadge]);

  useSocketNotifications(
    socket,
    () => {
      void syncInteractionsBadge();
    },
    Boolean(user?.id)
  );

  useEffect(() => {
    if (!user?.id) return;
    const myId = user.id;
    const checkUnreadMessages = async () => {
      try {
        const chats = await getUserChats();
        const onChatPage = pathname.startsWith('/chat');
        const openChatId = onChatPage ? currentChatIdRef.current : null;
        const hasUnread = chats.some((chat: Chat) => {
          if (openChatId && chat.id === openChatId) return false;
          if (!chat.messages || chat.messages.length === 0) return false;
          const lastMessage = chat.messages[0];
          return lastMessageIsUnreadIncomingForUser(lastMessage, myId);
        });
        setHasUnreadMessages(hasUnread);
      } catch {
        setHasUnreadMessages(false);
      }
    };
    void checkUnreadMessages();
    const handleFocus = () => {
      void checkUnreadMessages();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkUnreadMessages();
      }
    };
    const interval = setInterval(() => {
      void checkUnreadMessages();
    }, 5000);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.id, pathname]);

  useEffect(() => {
    if (!socket || !user?.id) return;
    const handleNewMessage = (payload: unknown) => {
      const message = normalizeMessage(payload);
      if (!message || message.senderId === user.id) return;
      const onChatPage = pathname.startsWith('/chat');
      if (onChatPage && currentChatIdRef.current === message.chatId) return;
      setHasUnreadMessages(true);
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, user, pathname]);

  const showUnread = hasUnread && !pathname?.startsWith('/interactions');
  const showUnreadMessages = hasUnreadMessages && !pathname?.startsWith('/chat');
  const canModerate = user?.role === 'MODERATOR' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <header
        className={cn(
          'w-full sticky top-0 z-40',
          surface.glassNav,
          animations.fadeIn
        )}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center shrink-0 min-w-0">
            <Link
              href="/feed"
              className="text-xl font-bold text-foreground hover:text-primary transition-colors tracking-tight"
            >
              Innogram
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-2 sm:mx-4 hidden md:block min-w-0">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 text-left text-sm text-muted-foreground bg-muted/80 border border-border rounded-xl hover:bg-muted hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <button
              type="button"
              onClick={toggleColorMode}
              className={navBtn}
              title={resolvedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              aria-label={resolvedTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
            >
              {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className={cn(navBtn, 'md:hidden')}
              title="Поиск"
              aria-label="Поиск"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={cn(navBtn, 'hidden md:flex')}
              title="Создать пост"
              aria-label="Создать пост"
            >
              <PlusSquare className="w-5 h-5" />
            </button>
            <Link
              href="/chat"
              onClick={() => setHasUnreadMessages(false)}
              className={navBtn}
              aria-label="Сообщения"
            >
              <MessageSquare className="w-5 h-5" />
              {showUnreadMessages && (
                <span
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-background"
                  aria-hidden
                />
              )}
            </Link>
            <Link
              href="/interactions"
              onClick={() => setHasUnread(false)}
              className={navBtn}
              aria-label="Уведомления"
            >
              <Heart className="w-5 h-5" />
              {showUnread && (
                <span
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-background"
                  aria-hidden
                />
              )}
            </Link>
            {canModerate && (
              <Link href="/moderation" className={navBtn} aria-label="Модерация">
                <ShieldAlert className="w-5 h-5" />
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className={navBtn} aria-label="Админка">
                <ShieldCheck className="w-5 h-5" />
              </Link>
            )}
            <Link
              href="/profile/me"
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2 focus:ring-offset-background transition-all"
            >
              <Image
                src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                alt="Профиль"
                width={36}
                height={36}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </Link>
            <button
              type="button"
              onClick={logout}
              className={navBtn}
              title="Выйти"
              aria-label="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
