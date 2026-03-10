import { useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

interface SocketNotification {
  id: string;
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  itemId?: string;
  postId?: string;
  createdAt: string;
  actor: {
    id: string;
    username: string;
    avatarUrl: string | null;
  };
}

export function useSocketNotifications(
  socket: Socket | null,
  onNotification: (notification: SocketNotification) => void,
  enabled: boolean = true
): void {
  const onNotificationRef = useRef(onNotification);

  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!socket || !enabled) return;
    const handleNotification = (data: SocketNotification) => {
      onNotificationRef.current(data);
    };
    socket.on('notification', handleNotification);
    return () => {
      socket.off('notification', handleNotification);
    };
  }, [socket, enabled]);
}