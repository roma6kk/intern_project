'use client';

import { Grid, Heart, MessageCircle, Archive } from 'lucide-react';

interface EmptyStateProps {
  type: 'posts' | 'liked' | 'commented' | 'private' | 'archived';
}

export default function EmptyState({ type }: EmptyStateProps) {
  const map: Record<string, { icon?: typeof Grid | typeof Heart | typeof MessageCircle | typeof Archive; text: string; subtext?: string }> = {
    posts: { icon: Grid, text: 'No posts yet' },
    liked: { icon: Heart, text: 'No liked posts yet' },
    commented: { icon: MessageCircle, text: 'No commented posts yet' },
    archived: { icon: Archive, text: 'No archived posts yet' },
    private: { text: 'This Account is Private', subtext: 'Follow this account to see their posts' },
  };

  const config = map[type];
  const Icon = config?.icon;

  if (type === 'private') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full border-2 border-border flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-muted-foreground text-lg font-semibold mb-2">{config?.text}</p>
        {config?.subtext && <p className="text-muted-foreground text-sm text-center">{config.subtext}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      {Icon && <Icon className="w-16 h-16 text-muted-foreground mb-4" />}
      <p className="text-muted-foreground text-lg">{config?.text}</p>
    </div>
  );
}
