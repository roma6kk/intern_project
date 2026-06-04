'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from './auth-context';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
const DEBUG_SOCKET = process.env.NEXT_PUBLIC_DEBUG_SOCKET === 'true';

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
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
      socketRef.current.auth = { token };
      setSocket(socketRef.current);
      if (!socketRef.current.connected) socketRef.current.connect();
      return;
    }
    const instance = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });
    const log = (...args: unknown[]) => {
      if (DEBUG_SOCKET) {
        console.debug('[socket]', ...args);
      }
    };
    instance.on('connect', () => {
      log('connected', { id: instance.id, userId: userIdRef.current });
    });
    instance.on('disconnect', (reason) => {
      log('disconnected', { reason, userId: userIdRef.current });
    });
    instance.on('reconnect', (attempt) => {
      log('reconnected', { attempt, id: instance.id, userId: userIdRef.current });
    });
    instance.on('reconnect_attempt', () => {
      const latestToken = Cookies.get('accessToken');
      if (latestToken) {
        instance.auth = { token: latestToken };
      }
      log('reconnect_attempt', { hasToken: Boolean(latestToken), userId: userIdRef.current });
    });
    instance.on('connect_error', (error) => {
      log('connect_error', {
        message: error?.message,
        name: error?.name,
        userId: userIdRef.current,
      });
      const latestToken = Cookies.get('accessToken');
      if (!latestToken) return;
      if ((instance.auth as { token?: string } | undefined)?.token === latestToken) {
        return;
      }
      instance.auth = { token: latestToken };
      instance.connect();
    });

    const ensureConnectedWithFreshToken = () => {
      const latestToken = Cookies.get('accessToken');
      if (!latestToken) return;
      instance.auth = { token: latestToken };
      if (!instance.connected) {
        log('ensure_connect', { userId: userIdRef.current });
        instance.connect();
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        ensureConnectedWithFreshToken();
      }
    };
    const onWindowFocus = () => {
      ensureConnectedWithFreshToken();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', onWindowFocus);
    socketRef.current = instance;
    setSocket(instance);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', onWindowFocus);
      instance.removeAllListeners();
      instance.disconnect();
      socketRef.current = null;
      queueMicrotask(() => setSocket(null));
    };
  }, [user?.id]); /* depend on user id only: full `user` object identity changes teardown WS and wipe ToastProvider listeners */

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): Socket | null {
  return useContext(SocketContext);
}
