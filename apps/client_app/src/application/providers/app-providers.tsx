'use client';

import type { ReactNode } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
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
            <ToastContainer
              position="top-right"
              autoClose={4200}
              newestOnTop
              closeOnClick
              pauseOnHover
              pauseOnFocusLoss
              draggable
              transition={Slide}
              hideProgressBar={false}
              theme="colored"
              limit={4}
              toastClassName="!backdrop-blur-md"
            />
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
