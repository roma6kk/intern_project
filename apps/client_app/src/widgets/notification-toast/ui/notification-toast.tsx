'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

interface NotificationToastProps {
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM';
  actor: {
    username: string;
    avatarUrl: string | null;
  };
  itemId?: string;
  postId?: string;
  message?: string;
}

const typeLabels: Record<string, string> = {
  LIKE: 'лайкнул ваш пост',
  COMMENT: 'прокомментировал ваш пост',
  FOLLOW: 'подписался на вас',
  MENTION: 'упомянул вас',
  SYSTEM: 'модерация',
};

export function NotificationToast({
  type,
  actor,
  itemId,
  postId,
  message,
}: NotificationToastProps) {
  if (type === 'SYSTEM') {
    const link =
      postId
        ? `/post/${postId}`
        : `/profile/${actor.username}`;
    return (
      <Link href={link} className="flex items-start gap-3 p-2">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
          {actor.avatarUrl ? (
            <Image
              src={actor.avatarUrl}
              alt={actor.username}
              width={40}
              height={40}
              className="object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-amber-700" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-amber-800 uppercase">Moderation</p>
          <p className="text-sm text-foreground line-clamp-3">{message || 'New notice'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">@{actor.username}</p>
        </div>
      </Link>
    );
  }

  const link =
    type === 'FOLLOW'
      ? `/profile/${actor.username}`
      : postId
        ? `/post/${postId}`
        : itemId
          ? `/post/${itemId}`
          : `/profile/${actor.username}`;

  return (
    <Link href={link} className="flex items-center gap-3 p-2">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
        {actor.avatarUrl ? (
          <Image src={actor.avatarUrl} alt={actor.username} width={40} height={40} className="object-cover" />
        ) : (
          <User className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold text-muted-foreground">{actor.username}</span>{' '}
          <span className="text-muted-foreground">{typeLabels[type] ?? 'взаимодействовал с вами'}</span>
        </p>
      </div>
    </Link>
  );
}
