import { useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Message } from '@/types/index';

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
    socket.emit('join_chat', { chatId: normalizedChatId });

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        onNewMessageRef.current(message);
      }
    };

    const handleMessageUpdated = (message: Message) => {
      if (message.chatId === chatId) {
        onMessageUpdatedRef.current?.(message);
      }
    };

    const handleMessageDeleted = (payload: Message | { id: string }) => {
      onMessageDeletedRef.current?.(payload);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('message_deleted', handleMessageDeleted);

    return () => {
      socket.emit('leave_chat', { chatId: normalizedChatId });
      socket.off('new_message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('message_deleted', handleMessageDeleted);
    };
  }, [chatId, socket]);

  return socket;
}