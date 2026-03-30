'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Search, PlusSquare, Heart, User, ShieldAlert, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import CreatePostModal from '@/widgets/create-post-modal';
import { useAuth } from '@/entities/session';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

export function BottomNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname() ?? '';
  const canModerate = user?.role === 'MODERATOR' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';

  const item = (href: string, active: boolean) =>
    cn(
      'flex-1 flex justify-center py-2.5 rounded-xl transition-all duration-200',
      active
        ? 'text-primary bg-primary/12 shadow-[0_10px_24px_-18px_var(--primary)]'
        : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:-translate-y-0.5'
    );

  return (
    <>
      <nav
        className={cn(
          'md:hidden fixed bottom-3 left-2 right-2 z-40',
          surface.glassNav,
          animations.fadeIn
        )}
      >
        <div className="max-w-md mx-auto flex items-center p-1.5 gap-0.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] rounded-2xl border border-border/65 bg-card/70 backdrop-blur-xl shadow-[0_20px_40px_-24px_var(--overlay)]">
          <Link href="/feed" className={item('/feed', pathname === '/feed' || pathname.startsWith('/feed'))}>
            <Home className="w-6 h-6" strokeWidth={pathname.startsWith('/feed') ? 2.25 : 2} />
          </Link>
          <Link href="/search" className={item('/search', pathname.startsWith('/search'))}>
            <Search className="w-6 h-6" />
          </Link>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={cn(
              'flex-1 flex justify-center py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200'
            )}
            aria-label="Создать пост"
          >
            <PlusSquare className="w-6 h-6" />
          </button>
          <Link href="/interactions" className={item('/interactions', pathname.startsWith('/interactions'))}>
            <Heart className="w-6 h-6" />
          </Link>
          {canModerate && (
            <Link href="/moderation" className={item('/moderation', pathname.startsWith('/moderation'))}>
              <ShieldAlert className="w-6 h-6" />
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className={item('/admin', pathname.startsWith('/admin'))}>
              <ShieldCheck className="w-6 h-6" />
            </Link>
          )}
          <Link href="/profile" className={item('/profile', pathname.startsWith('/profile'))}>
            <User className="w-6 h-6" />
          </Link>
        </div>
      </nav>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
