'use client';

import { useState, useEffect } from 'react';
import { X, Search, Loader2, Users, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

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

export default function SharePostModal({ postId, onClose }: SharePostModalProps) {
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
      const postUrl = `${window.location.origin}/post/${postId}`;
      const messageContent = `Look at this post: ${postUrl}`;

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
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-500">Share</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-gray-500 ${
              activeTab === 'chats' ? 'border-b-2 border-black' : 'hover:text-gray-700'
            }`}
          >
            <MessageSquare size={18} />
            Recent Chats
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors text-gray-500 ${
              activeTab === 'people' ? 'border-b-2 border-black' : 'hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            Search People
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
          
          {activeTab === 'people' && (
            <>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={query}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 placeholder:text-gray-500"
                    autoFocus
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-gray-500" />
                </div>
              ) : userResults.length > 0 ? (
                <div className="space-y-1">
                  {userResults.map((profile) => (
                    <div key={profile.userId} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
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
                          <span className="font-semibold text-sm text-gray-500">{profile.user.account.username}</span>
                          <span className="text-xs text-gray-500">{profile.firstName}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendToUser(profile.userId)}
                        disabled={!!sendingTo}
                        className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        {sendingTo === profile.userId ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : query && (
                <div className="text-center p-8 text-gray-500">No users found</div>
              )}
            </>
          )}

          {activeTab === 'chats' && (
            <>
              {loading ? (
                 <div className="flex justify-center p-8">
                   <Loader2 className="animate-spin text-gray-500" />
                 </div>
              ) : chatResults.length > 0 ? (
                <div className="space-y-1">
                  {chatResults.map((chat) => {
                    const chatName = getChatName(chat);
                    const avatarUrl = getChatAvatar(chat);

                    return (
                      <div key={chat.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 relative shrink-0 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                                <Image
                                  src={avatarUrl}
                                  alt={chatName}
                                  fill
                                  className="object-cover"
                                />
                            ) : (
                                chat.type === 'GROUP' ? <Users size={20} className="text-gray-500"/> : <MessageSquare size={20} className="text-gray-500"/>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-gray-500">{chatName}</span>
                            <span className="text-xs text-gray-500">
                                {chat.type === 'GROUP' ? 'Group Chat' : 'Private Message'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSendToExistingChat(chat.id)}
                          disabled={!!sendingTo}
                          className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                        >
                          {sendingTo === chat.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No existing chats. <br/>
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