'use client';

import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
import TopNav from '@/components/TopNav';
import BottomNav from '@/components/BottomNav';
import { usePathname } from 'next/navigation';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login');

  if (isAuthPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}