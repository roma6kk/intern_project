import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Chat, Message } from '@/types/index';
import { getChatMessages, sendMessage, markChatAsRead } from '@/lib/services/chat.service';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/context/AuthContext';
import MessageBubble from './MessageBubble';
import ChatManagementModal from './ChatManagementModal';
import { Send, Loader2, Paperclip, X, Settings, ArrowLeft } from 'lucide-react';

const MAX_ATTACHMENTS = 10;

interface ChatWindowProps {
  chat: Chat;
  onMessagesRead?: () => void;
  onChatUpdated?: (updatedChat: Chat) => void;
  onLeftChat?: () => void;
  onBack?: () => void;
}

export default function ChatWindow({ chat, onMessagesRead, onChatUpdated, onLeftChat, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showManagementModal, setShowManagementModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [currentChat, setCurrentChat] = useState<Chat>(chat);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasMarkedAsReadRef = useRef(false);

  useEffect(() => {
    setCurrentChat(chat);
  }, [chat]);

  const otherMember = currentChat.members?.find((m) => m.id !== user?.id) ?? currentChat.members?.[0];
  const displayName =
    currentChat.type === 'GROUP'
      ? (currentChat.name || 'Group Chat')
      : (otherMember?.account?.username ?? 'User');

  const fetchMessages = useCallback(() => {
    setLoading(true);
    getChatMessages(chat.id)
      .then((msgs) => {
        setMessages(msgs);
        if (user && msgs.length > 0 && !hasMarkedAsReadRef.current) {
          const hasUnread = msgs.some((m) => !m.isRead && m.senderId !== user.id);
          if (hasUnread) {
            markChatAsRead(chat.id)
              .then(() => {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.senderId !== user.id ? { ...m, isRead: true } : m,
                  ),
                );
                onMessagesRead?.();
              })
              .catch(console.error);
            hasMarkedAsReadRef.current = true;
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [chat.id, user, onMessagesRead]);

  useEffect(() => {
    hasMarkedAsReadRef.current = false;
    fetchMessages();
  }, [chat.id, user?.id, fetchMessages]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchMessages();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [chat.id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useChatSocket({
    chatId: chat.id,
    onNewMessage: (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) {
          return prev;
        }
        if (user && msg.senderId !== user.id && !msg.isRead) {
          markChatAsRead(chat.id)
            .then(() => onMessagesRead?.())
            .catch(console.error);
          return [...prev, { ...msg, isRead: true }];
        }
        return [...prev, msg];
      });
    },
    onMessageUpdated: (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, ...msg } : m)),
      );
    },
    onMessageDeleted: (payload) => {
      setMessages((prev) => {
        const id = 'id' in payload ? payload.id : (payload as Message).id;
        const full = payload as Message;
        const deletedAt = full.deletedAt ?? new Date().toISOString();
        return prev.map((m) => {
          if (m.id === id) {
            return full.chatId !== undefined && full.deletedAt !== undefined
              ? { ...m, ...full }
              : { ...m, deletedAt, content: null, assets: [] };
          }
          if (m.replyToId === id || m.replyTo?.id === id) {
            return {
              ...m,
              replyTo: { ...m.replyTo, id, deletedAt, content: null, assets: [] } as Message,
            };
          }
          return m;
        });
      });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(e.target.files ?? []);
    e.target.value = '';
    setAttachedFiles((prev) => {
      const next = [...prev, ...chosen].slice(0, MAX_ATTACHMENTS);
      setPreviewUrls((urls) => {
        urls.forEach((u) => u && URL.revokeObjectURL(u));
        return next.map((f) =>
          f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
        );
      });
      return next;
    });
  };

  const removeAttachedFile = (index: number) => {
    setPreviewUrls((prev) => {
      const u = prev[index];
      if (u) URL.revokeObjectURL(u);
      return prev.filter((_, i) => i !== index);
    });
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const hasContent = inputText.trim().length > 0;
    const hasFiles = attachedFiles.length > 0;
    if ((!hasContent && !hasFiles) || sending) return;
    setSending(true);
    try {
      const sent = await sendMessage(
        chat.id,
        inputText.trim(),
        attachedFiles.length ? attachedFiles : undefined,
        replyingTo?.id ?? undefined,
      );
      if (sent) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === sent.id)) return prev;
          return [...prev, sent];
        });
      }
      setInputText('');
      setReplyingTo(null);
      setPreviewUrls((prev) => {
        prev.forEach((u) => u && URL.revokeObjectURL(u));
        return [];
      });
      setAttachedFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-3 py-3 sm:p-4 bg-white border-b flex items-center gap-3 shadow-sm z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
            aria-label="Назад к списку чатов"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {currentChat.type === 'PRIVATE' && otherMember?.account?.username ? (
            <Link
              href={`/profile/${otherMember.account.username}`}
              className="hover:opacity-80 transition-opacity block"
            >
              <h2 className="font-bold text-lg text-gray-800 truncate">{displayName}</h2>
            </Link>
          ) : (
            <h2 className="font-bold text-lg text-gray-800 truncate">{displayName}</h2>
          )}
          {currentChat.type === 'GROUP' && (
            <span className="text-xs font-normal text-gray-500">
              ({currentChat.members?.length ?? 0} members)
            </span>
          )}
        </div>
        {currentChat.type === 'GROUP' && (
          <button
            type="button"
            onClick={() => setShowManagementModal(true)}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Chat options"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="text-sm text-gray-600">Загрузка сообщений...</span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onReply={() => setReplyingTo(msg)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t">
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            <span className="truncate text-gray-600">
              Ответ на <strong>{replyingTo.sender?.account?.username ?? replyingTo.sender?.profile?.firstName ?? 'User'}</strong>
              {replyingTo.content != null && replyingTo.content !== '' && (
                <>: {replyingTo.content.slice(0, 50)}{replyingTo.content.length > 50 ? '…' : ''}</>
              )}
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="shrink-0 rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              aria-label="Отменить ответ"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {attachedFiles.length > 0 && (
          <div className="mb-3 max-h-[130px] max-w-[280px] rounded-xl border border-gray-200 bg-gray-50 p-1.5 overflow-hidden shrink-0">
            <div
              className={`grid h-[116px] max-w-[268px] gap-1 ${
                attachedFiles.length === 1
                  ? 'grid-cols-1 grid-rows-1'
                  : attachedFiles.length === 2
                    ? 'grid-cols-2 grid-rows-1'
                    : attachedFiles.length === 3
                      ? 'grid-cols-2 grid-rows-2 [&>div:first-child]:col-span-2'
                      : attachedFiles.length === 4
                        ? 'grid-cols-2 grid-rows-2'
                        : 'grid-cols-6 grid-rows-2 [&>div:nth-child(1)]:col-span-3 [&>div:nth-child(2)]:col-span-3 [&>div:nth-child(3)]:col-span-2 [&>div:nth-child(4)]:col-span-2 [&>div:nth-child(5)]:col-span-2'
              }`}
            >
              {attachedFiles.map((file, i) => (
                <div
                  key={`${file.name}-${i}`}
                  className="relative min-w-0 min-h-0 rounded-lg overflow-hidden bg-gray-200 group"
                >
                  {file.type.startsWith('image/') && previewUrls[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element -- blob preview URL
                    <img
                      src={previewUrls[i]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-gray-500 text-xs truncate w-full">{file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(i)}
                    className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Remove file"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={attachedFiles.length >= MAX_ATTACHMENTS}
            className="p-3 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            aria-label="Attach files"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 p-3 text-gray-500 border rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !attachedFiles.length) || sending}
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {currentChat.type === 'GROUP' && (
        <ChatManagementModal
          open={showManagementModal}
          onClose={() => setShowManagementModal(false)}
          chat={currentChat}
          onChatUpdated={(updatedChat) => {
            setCurrentChat(updatedChat);
            onChatUpdated?.(updatedChat);
          }}
          onLeftChat={onLeftChat}
        />
      )}
    </div>
  );
}