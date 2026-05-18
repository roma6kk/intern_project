import { useEffect, useRef } from 'react';
import { useSocket } from '@/entities/session';
import type { Message } from '@/entities/chat';

function inboundChatId(message: unknown): string | undefined {
  if (!message || typeof message !== 'object') return undefined;
  const m = message as Record<string, unknown>;
  const raw = m.chatId ?? m.chat_id;
  return typeof raw === 'string' ? raw.trim() : undefined;
}

interface UseChatSocketProps {
  chatId: string | null;
  onNewMessage: (message: Message) => void;
  onMessageUpdated?: (message: Message) => void;
  onMessageDeleted?: (payload: Message | { id: string }) => void;
}

export function useChatSocket({
  chatId,
  onNewMessage,
  onMessageUpdated,
  onMessageDeleted,
}: UseChatSocketProps) {
  const socket = useSocket();
  const socketRef = useRef(socket);
  const onNewMessageRef = useRef(onNewMessage);
  const onMessageUpdatedRef = useRef(onMessageUpdated);
  const onMessageDeletedRef = useRef(onMessageDeleted);

  useEffect(() => {
    onNewMessageRef.current = onNewMessage;
    onMessageUpdatedRef.current = onMessageUpdated;
    onMessageDeletedRef.current = onMessageDeleted;
    socketRef.current = socket;
  }, [onNewMessage, onMessageUpdated, onMessageDeleted, socket]);

  useEffect(() => {
    if (!chatId || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    const normalizedChatId = chatId.trim();
    const joinCurrentChat = () => {
      socket.emit('join_chat', { chatId: normalizedChatId });
    };
    joinCurrentChat();

    const handleNewMessage = (message: Message) => {
      if (inboundChatId(message) === normalizedChatId) {
        onNewMessageRef.current(message);
      }
    };

    const handleMessageUpdated = (message: Message) => {
      if (inboundChatId(message) === normalizedChatId) {
        onMessageUpdatedRef.current?.(message);
      }
    };

    const handleMessageDeleted = (payload: Message | { id: string }) => {
      onMessageDeletedRef.current?.(payload);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('connect', joinCurrentChat);

    return () => {
      socket.emit('leave_chat', { chatId: normalizedChatId });
      socket.off('new_message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('connect', joinCurrentChat);
    };
  }, [chatId, socket]);

  return socket;
}
