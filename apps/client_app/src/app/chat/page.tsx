'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import { getUserChats } from '@/lib/services/chat.service';
import { Chat } from '@/types/index';
import type { Message } from '@/types/index';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CreateChatModal from '@/components/chat/CreateChatModal';
import { currentChatIdRef } from '@/lib/currentChatId';
import { useSocket } from '@/context/SocketContext';

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
  const searchParams = useSearchParams();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const setChatsRef = useRef(setChats);
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
    const chatIdFromUrl = searchParams.get('chatId');
    if (chatIdFromUrl && chats.length > 0) {
      const chatExists = chats.some(c => c.id === chatIdFromUrl);
      if (chatExists && selectedChatId !== chatIdFromUrl) {
        queueMicrotask(() => setSelectedChatId(chatIdFromUrl));
      }
    }
  }, [chats, searchParams, selectedChatId]);

  useEffect(() => {
    currentChatIdRef.current = selectedChatId;
    if (selectedChatId && user) {
      getUserChats().then(setChats);
    }
    return () => {
      currentChatIdRef.current = null;
    };
  }, [selectedChatId, user]);

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
      if (socket && !socket.connected) socket.connect();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [user, socket]);

  const selectedChat = chats.find(c => c.id === selectedChatId);

  const content = isLoading ? (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
        <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        <p className="text-gray-600 font-medium">Loading chats...</p>
      </div>
    </div>
  ) : (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden bg-white shadow-sm mt-4 mx-4">
      <div className={`w-full md:w-1/3 border-r ${selectedChatId ? 'hidden md:block' : 'block'}`}>
        <div className="h-full flex flex-col">
          <div className="p-3 border-b flex justify-between">
            <div className="flex items-center font-bold text-lg text-gray-600 ml-3">
            Chats
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
              <MessageSquarePlus size={18} />
              New chat
            </button>
          </div>
          <ChatList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        </div>
      </div>

      <div className={`w-full md:w-2/3 ${!selectedChatId ? 'hidden md:block' : 'block'}`}>
        {selectedChat ? (
          <div className="h-full flex flex-col">
            <ChatWindow
              chat={selectedChat}
              onBack={() => setSelectedChatId(null)}
              onMessagesRead={() => {
                getUserChats().then(setChats);
              }}
              onChatUpdated={(updatedChat) => {
                setChats(prev => prev.map(c => (c.id === updatedChat.id ? updatedChat : c)));
              }}
              onLeftChat={() => {
                getUserChats().then(setChats);
                setSelectedChatId(null);
              }}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <MessageSquarePlus size={64} className="mb-4 opacity-50" />
            <p className="text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </div>
      <CreateChatModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(chat) => {
          setChats(prev => [chat, ...prev]);
          setSelectedChatId(chat.id);
        }}
      />
    </div>
  );
  return content;
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
            <p className="text-gray-600 font-medium">Loading chats...</p>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}