'use client';

import { useState, useEffect } from 'react';
import { X, Search, Loader2, Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import api from '@/shared/api';
import { useAuth } from '@/entities/session';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/cn';
import modal from '@/shared/styles/modal.module.css';

interface SharePostModalProps {
  postId: string;
  onClose: () => void;
}

interface UserResult {
  userId: string;
  user: { account: { username: string } };
  firstName: string;
  avatarUrl: string | null;
}

interface ChatResult {
  id: string;
  name?: string;
  type: 'PRIVATE' | 'GROUP';
  members: {
    id: string;
    profile?: {
      firstName: string;
      avatarUrl: string | null;
    };
    account?: {
      username: string;
    };
  }[];
}

export function SharePostModal({ postId, onClose }: SharePostModalProps) {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'people' | 'chats'>('chats');
  
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState<UserResult[]>([]);
  
  const [chatResults, setChatResults] = useState<ChatResult[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChats();
    }
  }, [activeTab]);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/chats');
      setChatResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setUserResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/profiles/search?query=${val}`);
      const filtered = Array.isArray(data)
        ? data.filter((u: UserResult) => u.userId !== currentUser?.id)
        : [];
      setUserResults(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToChat = async (chatId: string) => {
    try {
      const messageContent = `/post/${postId}`;

      await api.post('/messages', {
        chatId: chatId,
        content: messageContent,
        senderId: currentUser?.id
      });

      toast.success('Sent successfully');
      onClose();
    } catch (error) {
      console.error('Failed to send:', error);
      toast.error('Failed to send');
    }
  };

  const handleSendToUser = async (targetUserId: string) => {
    if (!currentUser) return;
    setSendingTo(targetUserId);
    try {
      const { data: chat } = await api.post('/chats', {
        memberIds: [currentUser.id, targetUserId],
      });
      await sendMessageToChat(chat.id);
    } catch {
        toast.error('Error creating chat');
    } finally {
      setSendingTo(null);
    }
  };

  const handleSendToExistingChat = async (chatId: string) => {
    setSendingTo(chatId);
    await sendMessageToChat(chatId);
    setSendingTo(null);
  };

  const getChatName = (chat: ChatResult) => {
    if (chat.type === 'GROUP') {
      return chat.name || `Group (${chat.members.length})`;
    }
    const otherMember = chat.members.find(m => m.id !== currentUser?.id) || chat.members[0];
    return otherMember?.account?.username || 'Unknown';
  };

  const getChatAvatar = (chat: ChatResult) => {
     if (chat.type === 'GROUP') return null;
     const otherMember = chat.members.find(m => m.id !== currentUser?.id) || chat.members[0];
     return otherMember?.profile?.avatarUrl;
  };

  const tabBtn = (active: boolean) =>
    cn(
      'flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-muted-foreground',
      active ? 'border-b-2 border-primary text-foreground' : 'hover:text-foreground'
    );

  return (
    <div className={modal.root}>
      <button type="button" className={modal.dim} onClick={onClose} aria-label="Закрыть" />
      <div className={cn(modal.shell, 'max-w-md flex flex-col max-h-[80vh]')}>
        <div className={modal.header}>
          <h2 className="text-lg font-semibold text-foreground">Share</h2>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-muted rounded-full text-muted-foreground">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-border">
          <button type="button" onClick={() => setActiveTab('chats')} className={tabBtn(activeTab === 'chats')}>
            <MessageSquare size={18} />
            Recent Chats
          </button>
          <button type="button" onClick={() => setActiveTab('people')} className={tabBtn(activeTab === 'people')}>
            <Users size={18} />
            Search People
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 min-h-[300px] min-h-0">
          {activeTab === 'people' && (
            <>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={e => handleSearchUsers(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground border border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : userResults.length > 0 ? (
                <div className="space-y-1">
                  {userResults.map(profile => (
                    <div
                      key={profile.userId}
                      className="flex items-center justify-between p-3 hover:bg-muted/60 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative shrink-0">
                          <Image
                            src={profile.avatarUrl || '/default-avatar.svg'}
                            alt={profile.user.account.username}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm text-foreground">{profile.user.account.username}</span>
                          <span className="text-xs text-muted-foreground">{profile.firstName}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendToUser(profile.userId)}
                        disabled={!!sendingTo}
                        className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                      >
                        {sendingTo === profile.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                query && <div className="text-center p-8 text-muted-foreground">No users found</div>
              )}
            </>
          )}

          {activeTab === 'chats' && (
            <>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-primary" />
                </div>
              ) : chatResults.length > 0 ? (
                <div className="space-y-1">
                  {chatResults.map(chat => {
                    const chatName = getChatName(chat);
                    const avatarUrl = getChatAvatar(chat);

                    return (
                      <div
                        key={chat.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/60 rounded-xl transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                              <Image src={avatarUrl} alt={chatName} fill className="object-cover" />
                            ) : chat.type === 'GROUP' ? (
                              <Users size={20} className="text-muted-foreground" />
                            ) : (
                              <MessageSquare size={20} className="text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground">{chatName}</span>
                            <span className="text-xs text-muted-foreground">
                              {chat.type === 'GROUP' ? 'Group Chat' : 'Private Message'}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSendToExistingChat(chat.id)}
                          disabled={!!sendingTo}
                          className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                        >
                          {sendingTo === chat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No existing chats. <br />
                  Switch to &quot;Search People&quot; to start a new one.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
