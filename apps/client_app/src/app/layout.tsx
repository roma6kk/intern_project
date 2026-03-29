'use client';

import { ThemeScript } from '@/shared/ui/theme-script';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import { AppProviders } from '@/application/providers/app-providers';
import { LayoutContent } from '@/application/layout/layout-content';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeScript />
        <AppProviders>
          <LayoutContent>{children}</LayoutContent>
        </AppProviders>
      </body>
    </html>
  );
}
