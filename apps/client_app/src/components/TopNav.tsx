'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MessageSquare, PlusSquare, Heart, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import CreatePostModal from './CreatePostModal';
import SearchModal from './SearchModal';
import api from '@/lib/api';
import type { Notification } from '@/types';
import { useSocketNotifications } from '@/hooks/useSocketNotifications';
import { useSocket } from '@/context/SocketContext';
import { getUserChats } from '@/lib/services/chat.service';
import { currentChatIdRef } from '@/lib/currentChatId';
import type { Chat, Message } from '@/types';

function normalizeMessage(payload: unknown): Message | null {
  if (!payload || typeof payload !== 'object') return null;
  const m = payload as Record<string, unknown>;
  const chatId = (m.chatId as string) ?? (m.chat_id as string);
  if (!chatId) return null;
  const senderId = (m.senderId as string) ?? (m.sender_id as string);
  return { ...m, chatId, senderId } as Message;
}

export default function TopNav() {
  const pathnameValue = usePathname();
  const pathname = pathnameValue ?? '';
  const { user, logout } = useAuth();
  const socket = useSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    async function checkUnread() {
      try {
        const res = await api.get('/notification/me');
        setHasUnread(res.data.some((n: Notification) => !n.isRead));
      } catch {}
    }
    checkUnread();

    const handleFocus = () => {
      void checkUnread();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkUnread();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useSocketNotifications(socket, () => {
    setHasUnread(true);
  });

  useEffect(() => {
    if (!user) return;
    const checkUnreadMessages = async () => {
      try {
        const chats = await getUserChats();
        const currentChatId = currentChatIdRef.current;
        const hasUnread = chats.some((chat: Chat) => {
          if (chat.id === currentChatId) return false;
          if (!chat.messages || chat.messages.length === 0) return false;
          const lastMessage = chat.messages[0];
          return !lastMessage.isRead && lastMessage.senderId !== user.id;
        });
        setHasUnreadMessages(hasUnread);
      } catch {
        setHasUnreadMessages(false);
      }
    };
    checkUnreadMessages();
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
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;
    const handleNewMessage = (payload: unknown) => {
      const message = normalizeMessage(payload);
      if (!message || message.senderId === user.id) return;
      if (currentChatIdRef.current === message.chatId) return;
      setHasUnreadMessages(true);
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, user]);


  const showUnread = hasUnread && !pathname?.startsWith('/interactions');
  const showUnreadMessages = hasUnreadMessages && !pathname?.startsWith('/chat');

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center shrink-0">
            <Link
              href="/feed"
              className="text-xl font-bold text-gray-700 hover:text-gray-900 transition-colors tracking-tight"
            >
              Innogram
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 text-left text-sm text-gray-600 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              title="Поиск"
              aria-label="Поиск"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              title="Создать пост"
              aria-label="Создать пост"
            >
              <PlusSquare className="w-5 h-5" />
            </button>
            <Link
              href="/chat"
              onClick={() => setHasUnreadMessages(false)}
              className="relative flex p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              aria-label="Сообщения"
            >
              <MessageSquare className="w-5 h-5" />
              {showUnreadMessages && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" aria-hidden />
              )}
            </Link>
            <Link
              href="/interactions"
              onClick={() => setHasUnread(false)}
              className="relative flex p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              aria-label="Уведомления"
            >
              <Heart className="w-5 h-5" />
              {showUnread && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" aria-hidden />
              )}
            </Link>
            <Link
              href="/profile/me"
              className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1 rounded-full transition-all"
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
              onClick={logout}
              className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              title="Выйти"
              aria-label="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
