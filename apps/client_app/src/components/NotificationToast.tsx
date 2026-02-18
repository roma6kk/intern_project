'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';

interface NotificationToastProps {
  type: 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION';
  actor: {
    username: string;
    avatarUrl: string | null;
  };
  itemId?: string;
  postId?: string;
}

const typeLabels: Record<string, string> = {
  LIKE: 'лайкнул ваш пост',
  COMMENT: 'прокомментировал ваш пост',
  FOLLOW: 'подписался на вас',
  MENTION: 'упомянул вас',
};

export default function NotificationToast({ type, actor, itemId, postId }: NotificationToastProps) {
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
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {actor.avatarUrl ? (
          <Image src={actor.avatarUrl} alt={actor.username} width={40} height={40} className="object-cover" />
        ) : (
          <User className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{actor.username}</span>{' '}
          <span className="text-gray-600">{typeLabels[type] ?? 'взаимодействовал с вами'}</span>
        </p>
      </div>
    </Link>
  );
}
