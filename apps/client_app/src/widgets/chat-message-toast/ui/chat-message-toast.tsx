'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { Message } from '@/entities/chat';
import { getMessagePreviewText } from '@/shared/lib/message-preview';

interface ChatMessageToastProps {
  message: Message;
}

export function ChatMessageToast({ message }: ChatMessageToastProps) {
  const name = message.sender?.profile?.firstName
    || message.sender?.account?.username
    || 'Someone';
  const avatarUrl = message.sender?.profile?.avatarUrl ?? null;
  const previewRaw = getMessagePreviewText({
    content: message.content,
    deletedAt: message.deletedAt,
    assetsCount: message.assets?.length,
  });
  const preview =
    previewRaw.length > 60
      ? `${previewRaw.slice(0, 60)}${previewRaw.length > 60 ? '…' : ''}`
      : previewRaw;

  const href = `/chat?chatId=${encodeURIComponent(message.chatId)}`;

  return (
    <Link
      href={href}
      className="relative z-[2] flex min-h-0 w-full flex-1 min-w-0 cursor-pointer flex-row items-center gap-3 self-stretch p-2"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="40px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-muted-foreground">{name}</p>
        <p className="truncate text-sm text-muted-foreground">{preview}</p>
      </div>
    </Link>
  );
}
