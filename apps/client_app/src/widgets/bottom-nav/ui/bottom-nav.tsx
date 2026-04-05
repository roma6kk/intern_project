'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Search, PlusSquare, User, ShieldAlert, ShieldCheck, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import CreatePostModal from '@/widgets/create-post-modal';
import { useAuth, useSocket } from '@/entities/session';
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

export function BottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const socket = useSocket();
  const pathname = usePathname() ?? '';
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR';

  useEffect(() => {
    let cancelled = false;
    const myId = user?.id;
    const checkUnreadMessages = async () => {
      if (!myId) {
        if (!cancelled) setHasUnreadMessages(false);
        return;
      }
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
    if (!myId) {
      return () => {
        cancelled = true;
      };
    }
    const interval = setInterval(() => {
      void checkUnreadMessages();
    }, 5000);
    const handleFocus = () => {
      void checkUnreadMessages();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkUnreadMessages();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      cancelled = true;
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

  const showUnreadMessages = hasUnreadMessages && !pathname.startsWith('/chat');
  const item = (href: string, active: boolean) =>
    cn(
      'flex-1 flex justify-center py-2.5 rounded-xl transition-all duration-200',
      active
        ? 'text-primary bg-primary/12 shadow-[0_10px_24px_-18px_var(--primary)]'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:-translate-y-0.5'
    );

  return (
    <>
      <nav
        className={cn(
          'md:hidden fixed inset-x-0 bottom-0 z-40 max-w-full overflow-x-hidden px-2 pb-[max(0.375rem,env(safe-area-inset-bottom))]',
          surface.glassNav,
          animations.fadeIn
        )}
      >
        <div className="w-full max-w-md mx-auto flex items-center p-1.5 gap-0.5 rounded-2xl border border-border/65 bg-card/70 backdrop-blur-xl shadow-[0_20px_40px_-24px_var(--overlay)]">
          <Link href="/feed" className={item('/feed', pathname === '/feed' || pathname.startsWith('/feed'))}>
            <Home className="w-6 h-6" strokeWidth={pathname.startsWith('/feed') ? 2.25 : 2} />
          </Link>
          <Link href="/search" className={item('/search', pathname.startsWith('/search'))}>
            <Search className="w-6 h-6" />
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={cn(
              'flex-1 flex justify-center py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200'
            )}
            aria-label="Создать пост"
          >
            <PlusSquare className="w-6 h-6" />
          </button>
          {isAdmin ? (
            <Link href="/admin" className={item('/admin', pathname.startsWith('/admin'))}>
              <ShieldCheck className="w-6 h-6" />
            </Link>
          ) : isModerator ? (
            <Link href="/moderation" className={item('/moderation', pathname.startsWith('/moderation'))}>
              <ShieldAlert className="w-6 h-6" />
            </Link>
          ) : (
            <Link
              href="/chat"
              onClick={() => setHasUnreadMessages(false)}
              className={cn(item('/chat', pathname.startsWith('/chat')), 'relative')}
            >
              <MessageSquare className="w-6 h-6" />
              {showUnreadMessages && (
                <span
                  className="absolute top-2.5 right-3.5 w-2.5 h-2.5 bg-destructive rounded-full ring-2 ring-background"
                  aria-hidden
                />
              )}
            </Link>
          )}
          <Link href="/profile" className={item('/profile', pathname.startsWith('/profile'))}>
            <User className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
