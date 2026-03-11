'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import type { Message } from '@/types';

interface ChatMessageToastProps {
  message: Message;
}

export default function ChatMessageToast({ message }: ChatMessageToastProps) {
  const name = message.sender?.profile?.firstName
    || message.sender?.account?.username
    || 'Someone';
  const avatarUrl = message.sender?.profile?.avatarUrl ?? null;
  const preview =
    message.content && message.content.length > 0
      ? `${message.content.slice(0, 60)}${message.content.length > 60 ? '…' : ''}`
      : 'Photo';

  return (
    <Link href={`/chat?chatId=${message.chatId}`} className="flex items-center gap-3 p-2 min-w-0">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={name} width={40} height={40} className="object-cover" />
        ) : (
          <MessageCircle className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-500 truncate">{name}</p>
        <p className="text-sm text-gray-600 truncate">{preview}</p>
      </div>
    </Link>
  );
}
