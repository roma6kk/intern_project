'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { ToastProvider } from '@/context/ToastContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import RecoveryBanner from '@/components/RecoveryBanner';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const isAuthPage = pathname?.startsWith('/login');
  const isChatPage = pathname?.startsWith('/chat');
  const isDeleted = user?.deletedAt && !isAuthPage;

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!isLoading && isDeleted) {
    return <RecoveryBanner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      {!isChatPage && <BottomNav />}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <LayoutContent>{children}</LayoutContent>
              <ToastContainer position="top-right" autoClose={3000} />
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}