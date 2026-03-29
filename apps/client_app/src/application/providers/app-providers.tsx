'use client';

import type { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, SocketProvider } from '@/entities/session';
import { ThemeProvider } from '@/application/providers/theme-provider';
import { ToastProvider } from '@/application/providers/toast-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
