'use client';

import { Grid, Heart, MessageCircle, Archive } from 'lucide-react';

type ProfileTabKey = 'posts' | 'liked' | 'commented' | 'archived';

interface ProfileTabsProps {
  activeTab: ProfileTabKey;
  setActiveTab: (tab: ProfileTabKey) => void;
  showLikedCommented?: boolean;
  showArchived?: boolean;
}

export default function ProfileTabs({ activeTab, setActiveTab, showLikedCommented = false, showArchived = false }: ProfileTabsProps) {
  const tabs = [
    { key: 'posts' as const, icon: Grid, label: 'Posts' },
    ...(showLikedCommented ? [
      { key: 'liked' as const, icon: Heart, label: 'Liked' },
      { key: 'commented' as const, icon: MessageCircle, label: 'Commented' },
    ] : []),
    ...(showArchived ? [{ key: 'archived' as const, icon: Archive, label: 'Archived' }] : []),
  ];

  return (
    <div className="border-b border-border sticky top-0 bg-card z-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-8 justify-center">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`py-4 px-2 font-semibold text-sm uppercase tracking-wider transition-colors relative ${
                  activeTab === t.key ? 'text-black' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {t.label}
                </div>
                {activeTab === t.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
