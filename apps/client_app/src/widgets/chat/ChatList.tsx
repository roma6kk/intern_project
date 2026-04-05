import { useMemo } from 'react';
import type { Chat } from '@/entities/chat';
import { useAuth } from '@/entities/session';
import Image from 'next/image';
import { User, Users } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

function getLastMessageAt(chat: Chat): number {
  const lastMessage = chat.messages?.[0];
  if (!lastMessage?.createdAt) return 0;
  return new Date(lastMessage.createdAt).getTime();
}

export default function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
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
            const avatarUrl = otherMember?.profile?.avatarUrl;
            
            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group mx-2 my-1.5 w-[calc(100%-1rem)] rounded-2xl border p-3.5 flex items-center gap-3 text-left transition-all ${
                  selectedChatId === chat.id
                    ? 'border-primary/50 bg-primary/10 shadow-[0_12px_30px_-18px_color-mix(in_srgb,var(--primary)_60%,transparent)]'
                    : 'border-transparent hover:border-border/70 hover:bg-muted/55'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center border ${
                  selectedChatId === chat.id ? 'border-primary/45 bg-primary/15' : 'border-border/60 bg-muted'
                }`}>
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={chatName} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    chat.type === 'GROUP' ? <Users size={20} className="text-muted-foreground"/> : <User size={20} className="text-muted-foreground"/>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{chatName}</h3>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {chat.messages && chat.messages.length > 0 
                      ? chat.messages[0].content 
                      : 'Нет сообщений'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}