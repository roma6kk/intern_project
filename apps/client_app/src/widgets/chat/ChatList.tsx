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
    <div className="flex flex-col h-full overflow-y-auto bg-card border-r">
      <div className="flex-1">
        {sortedChats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No chats yet</div>
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
                className={`w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left ${
                  selectedChatId === chat.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={chatName} width={48} height={48} className="object-cover w-full h-full" />
                  ) : (
                    chat.type === 'GROUP' ? <Users size={20} className="text-muted-foreground"/> : <User size={20} className="text-muted-foreground"/>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-muted-foreground truncate">{chatName}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.messages && chat.messages.length > 0 
                      ? chat.messages[0].content 
                      : 'No messages yet'}
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