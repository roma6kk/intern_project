'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { toast, type ToastOptions } from 'react-toastify';
import { useSocketNotifications } from '@/hooks/useSocketNotifications';
import NotificationToast from '@/components/NotificationToast';
import ChatMessageToast from '@/components/chat/ChatMessageToast';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/context/SocketContext';
import { currentChatIdRef } from '@/lib/currentChatId';
import type { Message } from '@/types';

interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function normalizeMessage(payload: unknown): Message | null {
  if (!payload || typeof payload !== 'object') return null;
  const m = payload as Record<string, unknown>;
  const chatId = (m.chatId as string) ?? (m.chat_id as string);
  if (!chatId) return null;
  const senderId = (m.senderId as string) ?? (m.sender_id as string);
  return { ...m, chatId, senderId } as Message;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();
  const { user } = useAuth();
  const userIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    userIdRef.current = user?.id;
  }, [user?.id]);

  useSocketNotifications(socket, (notification) => {
    toast(
      <NotificationToast
        type={notification.type}
        actor={notification.actor}
        itemId={notification.itemId}
        postId={notification.postId}
      />
    );
  });

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (payload: unknown) => {
      const message = normalizeMessage(payload);
      if (!message) return;
      if (currentChatIdRef.current === message.chatId) return;
      const myId = userIdRef.current;
      if (myId && message.senderId === myId) return;
      toast(<ChatMessageToast message={message} />);
    };
    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket]);

  const contextValue: ToastContextValue = {
    success: (message, options) => toast.success(message, options),
    error: (message, options) => toast.error(message, options),
    info: (message, options) => toast.info(message, options),
    warning: (message, options) => toast.warning(message, options),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
