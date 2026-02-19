'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

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

let socket: Socket | null = null;

export function getSocket(token: string): Socket {
  if (!socket) {
    socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function useSocketNotifications(
  token: string | null,
  onNotification: (notification: SocketNotification) => void,
  enabled: boolean = true
): void {
  const onNotificationRef = useRef(onNotification);
  
  useEffect(() => {
    onNotificationRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    if (!token || !enabled) return;
    console.log("TOKEN", token);

    const socketInstance = getSocket(token);
    socketInstance.on("connect", () => console.log("WS CONNECTED"));
    const handleNotification = (data: SocketNotification) => {
      onNotificationRef.current(data);
    };

    socketInstance.on("notification", (n) => {
  console.log("RECEIVED", n);});
    socketInstance.on('notification', handleNotification);

    return () => {
      socketInstance.off('notification', handleNotification);
    };
  }, [token, enabled]);
}
