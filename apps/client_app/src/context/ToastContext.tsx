'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { toast, type ToastOptions } from 'react-toastify';
import { useSocketNotifications } from '@/lib/socket';
import NotificationToast from '@/components/NotificationToast';
import Cookies from 'js-cookie';
interface ToastContextValue {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const token = Cookies.get('accessToken') ?? null;

  useSocketNotifications(token, (notification) => {
    toast(
      <NotificationToast
        type={notification.type}
        actor={notification.actor}
        itemId={notification.itemId}
        postId={notification.postId}
      />
    );
  });

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
