import { useMemo } from 'react';
import type { Chat } from '@/entities/chat';
import { lastMessageIsUnreadIncomingForUser } from '@/entities/chat';
import { useAuth } from '@/entities/session';
import { cn } from '@/shared/lib/cn';
import { getMessagePreviewText } from '@/shared/lib/message-preview';
import Image from 'next/image';
import { User, Users } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onlineUserIds?: Set<string>;
}

function getLastMessageAt(chat: Chat): number {
  const lastMessage = chat.messages?.[0];
  if (!lastMessage?.createdAt) return 0;
  return new Date(lastMessage.createdAt).getTime();
}

export default function ChatList({ chats, selectedChatId, onSelectChat, onlineUserIds }: ChatListProps) {
  const { user } = useAuth();

  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => getLastMessageAt(b) - getLastMessageAt(a));
  }, [chats]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-card/55">
      <div className="flex-1">
        {sortedChats.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">Пока нет чатов</div>
        ) : (
          sortedChats.map((chat) => {
            const otherMember = chat.members.find(m => m.id !== user?.id) || chat.members[0];
            const chatName = chat.type === 'GROUP'
              ? (chat.name || 'Group Chat')
              : (otherMember?.account?.username ?? 'User');
            const avatarUrl =
              chat.type === 'GROUP' ? (chat.avatarUrl ?? null) : (otherMember?.profile?.avatarUrl ?? null);
            const isOnline = Boolean(otherMember?.id && onlineUserIds?.has(otherMember.id));
            const lastMessage = chat.messages?.[0];
            const lastMessagePreview = getMessagePreviewText({
              content: lastMessage?.content,
              deletedAt: lastMessage?.deletedAt,
              assetsCount: lastMessage?.assets?.length,
            });
            const myId = user?.id;
            const incomingUnread =
              !!myId &&
              lastMessage != null &&
              selectedChatId !== chat.id &&
              lastMessageIsUnreadIncomingForUser(lastMessage, myId);

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  'group mx-2 my-1.5 w-[calc(100%-1rem)] rounded-2xl border p-3.5 flex items-center gap-3 text-left transition-all',
                  selectedChatId === chat.id &&
                    'border-primary/50 bg-primary/10 shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_60%,transparent)]',
                  selectedChatId !== chat.id && !incomingUnread &&
                    'border-transparent hover:border-border/70 hover:bg-muted/55',
                  incomingUnread &&
                    'border-primary/35 bg-primary/[0.08] shadow-[0_12px_28px_-20px_color-mix(in_srgb,var(--primary)_55%,transparent)] hover:border-primary/45 hover:bg-primary/[0.12]'
                )}
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center border',
                      selectedChatId === chat.id && 'border-primary/45 bg-primary/15',
                      selectedChatId !== chat.id &&
                        incomingUnread &&
                        'border-primary/40 bg-primary/10 ring-2 ring-primary/15',
                      selectedChatId !== chat.id &&
                        !incomingUnread &&
                        'border-border/60 bg-muted'
                    )}
                  >
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={chatName} width={48} height={48} className="object-cover w-full h-full" />
                    ) : (
                      chat.type === 'GROUP' ? <Users size={20} className="text-muted-foreground"/> : <User size={20} className="text-muted-foreground"/>
                    )}
                  </div>
                  {chat.type === 'PRIVATE' && isOnline && (
                    <span
                      className="-right-0.5 -bottom-0.5 absolute size-3 rounded-full bg-emerald-500 ring-2 ring-card"
                      aria-label="Пользователь в сети"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3
                      className={cn(
                        'truncate',
                        incomingUnread ? 'font-bold text-foreground' : 'font-semibold text-foreground'
                      )}
                    >
                      {chatName}
                    </h3>
                    <p
                      className={cn(
                        'text-sm truncate mt-0.5',
                        incomingUnread ? 'text-foreground/90 font-medium' : 'text-muted-foreground'
                      )}
                    >
                      {lastMessagePreview}
                    </p>
                  </div>
                  {incomingUnread && (
                    <span
                      className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary)_22%,transparent)]"
                      aria-label="Не прочитано"
                    />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}