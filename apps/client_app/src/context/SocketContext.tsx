'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
        queueMicrotask(() => setSocket(null));
      }
      return;
    }
    const token = Cookies.get('accessToken');
    if (!token || !WS_URL) return;
    if (socketRef.current) {
      setSocket(socketRef.current);
      if (!socketRef.current.connected) socketRef.current.connect();
      return;
    }
    const instance = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });
    socketRef.current = instance;
    setSocket(instance);
    return () => {
      instance.removeAllListeners();
      instance.disconnect();
      socketRef.current = null;
      queueMicrotask(() => setSocket(null));
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): Socket | null {
  return useContext(SocketContext);
}
