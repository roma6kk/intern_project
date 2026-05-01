import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { Chat, Message } from '@/entities/chat';
import { getChatMessages, sendMessage, markChatAsRead } from '@/entities/chat';
import {
  assistantTopicSuggestions,
  assistantDialogSummary,
  assistantChatQa,
  type TopicSuggestionsData,
  type DialogSummaryData,
  type ChatQaData,
  type AssistantMeta,
} from '@/entities/assistant';
import { useChatSocket } from '@/features/chat-socket';
import { useAuth } from '@/entities/session';
import MessageBubble from './MessageBubble';
import ChatManagementModal from './ChatManagementModal';
import {
  Send,
  Loader2,
  Paperclip,
  X,
  Settings,
  ArrowLeft,
  Lightbulb,
  ListOrdered,
  MessageCircleQuestion,
} from 'lucide-react';

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
  const [assistantBusy, setAssistantBusy] = useState<'topic' | 'summary' | 'qa' | null>(null);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  type AssistantPanel =
    | { kind: 'idle' }
    | { kind: 'topic'; data: TopicSuggestionsData; meta?: AssistantMeta }
    | { kind: 'summary'; data: DialogSummaryData; meta?: AssistantMeta }
    | { kind: 'qa'; data: ChatQaData; meta?: AssistantMeta };
  const [assistantPanel, setAssistantPanel] = useState<AssistantPanel>({ kind: 'idle' });
  const [topicTargetUserId, setTopicTargetUserId] = useState<string | undefined>(undefined);
  const [qaInput, setQaInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasMarkedAsReadRef = useRef(false);

  useEffect(() => {
    setCurrentChat(chat);
  }, [chat]);

  const otherMembers = useMemo(
    () => currentChat.members?.filter((m) => m.id !== user?.id) ?? [],
    [currentChat.members, user?.id],
  );

  useEffect(() => {
    setAssistantPanel({ kind: 'idle' });
    setAssistantError(null);
    setQaInput('');
  }, [chat.id]);

  useEffect(() => {
    if (otherMembers.length >= 1) {
      setTopicTargetUserId(otherMembers[0].id);
    } else {
      setTopicTargetUserId(undefined);
    }
  }, [chat.id, otherMembers]);
  const otherMember = otherMembers[0] ?? currentChat.members?.[0];
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

  const handleTopicSuggestions = async () => {
    if (!user || assistantBusy) return;
    setAssistantBusy('topic');
    setAssistantError(null);
    try {
      const targetUserId =
        currentChat.type === 'GROUP' && otherMembers.length > 1
          ? topicTargetUserId
          : undefined;
      const res = await assistantTopicSuggestions(chat.id, targetUserId);
      if (res.success) {
        setAssistantPanel({ kind: 'topic', data: res.data, meta: res.meta });
      } else {
        setAssistantError(res.message);
        setAssistantPanel({ kind: 'idle' });
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Ошибка запроса';
      setAssistantError(msg);
    } finally {
      setAssistantBusy(null);
    }
  };

  const handleDialogSummary = async () => {
    if (!user || assistantBusy) return;
    setAssistantBusy('summary');
    setAssistantError(null);
    try {
      const res = await assistantDialogSummary(chat.id, 5);
      if (res.success) {
        setAssistantPanel({ kind: 'summary', data: res.data, meta: res.meta });
      } else {
        setAssistantError(res.message);
        setAssistantPanel({ kind: 'idle' });
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Ошибка запроса';
      setAssistantError(msg);
    } finally {
      setAssistantBusy(null);
    }
  };

  const handleChatQa = async () => {
    if (!user || assistantBusy || !qaInput.trim()) return;
    setAssistantBusy('qa');
    setAssistantError(null);
    try {
      const res = await assistantChatQa(chat.id, qaInput.trim());
      if (res.success) {
        setAssistantPanel({ kind: 'qa', data: res.data, meta: res.meta });
      } else {
        setAssistantError(res.message);
        setAssistantPanel({ kind: 'idle' });
      }
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Ошибка запроса';
      setAssistantError(msg);
    } finally {
      setAssistantBusy(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="px-3 py-3 sm:p-4 bg-card/80 border-b border-border/60 flex items-center gap-3 shadow-[0_10px_24px_-20px_var(--overlay)] backdrop-blur-sm z-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-muted text-foreground hover:bg-muted active:bg-gray-300 transition-colors touch-manipulation"
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
              <h2 className="font-bold text-lg text-foreground truncate">{displayName}</h2>
            </Link>
          ) : (
            <h2 className="font-bold text-lg text-foreground truncate">{displayName}</h2>
          )}
          {currentChat.type === 'GROUP' && (
            <span className="text-xs font-normal text-muted-foreground">
              ({currentChat.members?.length ?? 0} members)
            </span>
          )}
        </div>
        {currentChat.type === 'GROUP' && (
          <button
            type="button"
            onClick={() => setShowManagementModal(true)}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors shrink-0"
            aria-label="Chat options"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {/* AI assistant */}
      <div className="border-b border-border/50 bg-muted/20 px-3 py-2 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {currentChat.type === 'GROUP' && otherMembers.length > 1 && (
            <select
              value={topicTargetUserId ?? ''}
              onChange={(e) => setTopicTargetUserId(e.target.value || undefined)}
              className="text-xs rounded-lg border border-border/70 bg-card px-2 py-1.5 max-w-[160px]"
              aria-label="Собеседник для подсказки темы"
            >
              {otherMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.account?.username ?? m.profile?.firstName ?? m.id.slice(0, 8)}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleTopicSuggestions}
            disabled={!!assistantBusy || !user}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            {assistantBusy === 'topic' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Lightbulb className="w-3.5 h-3.5" />
            )}
            Темы
          </button>
          <button
            type="button"
            onClick={handleDialogSummary}
            disabled={!!assistantBusy || !user}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            {assistantBusy === 'summary' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ListOrdered className="w-3.5 h-3.5" />
            )}
            Итоги
          </button>
          <div className="flex flex-1 min-w-[200px] items-center gap-1">
            <input
              value={qaInput}
              onChange={(e) => setQaInput(e.target.value)}
              placeholder="Вопрос по чату…"
              className="flex-1 min-w-0 rounded-full border border-border/70 bg-card/90 px-3 py-1.5 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleChatQa();
                }
              }}
            />
            <button
              type="button"
              onClick={handleChatQa}
              disabled={!!assistantBusy || !user || !qaInput.trim()}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-primary/90 px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              aria-label="Спросить AI"
            >
              {assistantBusy === 'qa' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <MessageCircleQuestion className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
        {assistantError && (
          <p className="text-xs text-destructive" role="alert">
            {assistantError}
          </p>
        )}
        {assistantPanel.kind === 'topic' && (
          <div className="rounded-lg border border-border/60 bg-card/80 p-3 text-sm space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="font-medium text-foreground">Идеи для разговора</span>
              {assistantPanel.meta?.source === 'fallback' && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">без LLM</span>
              )}
            </div>
            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
              {assistantPanel.data.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {assistantPanel.kind === 'summary' && (
          <div className="rounded-lg border border-border/60 bg-card/80 p-3 text-sm space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="font-medium text-foreground">Краткое резюме</span>
              {assistantPanel.meta?.source === 'fallback' && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">без LLM</span>
              )}
            </div>
            <p className="text-muted-foreground">{assistantPanel.data.summary}</p>
            {assistantPanel.data.actionItems.length > 0 && (
              <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                {assistantPanel.data.actionItems.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {assistantPanel.kind === 'qa' && (
          <div className="rounded-lg border border-border/60 bg-card/80 p-3 text-sm space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="font-medium text-foreground">Ответ</span>
              {assistantPanel.meta?.source === 'fallback' && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">без LLM</span>
              )}
            </div>
            <p className="text-muted-foreground whitespace-pre-wrap">{assistantPanel.data.answer}</p>
            {assistantPanel.data.citations.length > 0 && (
              <div className="text-xs text-muted-foreground space-y-1">
                <span className="font-medium text-foreground/80">Цитаты:</span>
                {assistantPanel.data.citations.map((c, i) => (
                  <blockquote key={i} className="border-l-2 border-primary/40 pl-2 italic">
                    {c.excerpt}
                  </blockquote>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_36%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_40%)]">
        {loading ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Загрузка сообщений...</span>
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
      <div className="p-4 bg-card/85 border-t border-border/60 backdrop-blur-sm">
        {replyingTo && (
          <div className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/45 px-3 py-2 text-sm">
            <span className="truncate text-muted-foreground">
              Ответ на <strong>{replyingTo.sender?.account?.username ?? replyingTo.sender?.profile?.firstName ?? 'User'}</strong>
              {replyingTo.content != null && replyingTo.content !== '' && (
                <>: {replyingTo.content.slice(0, 50)}{replyingTo.content.length > 50 ? '…' : ''}</>
              )}
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Отменить ответ"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {attachedFiles.length > 0 && (
          <div className="mb-3 max-h-[130px] max-w-[280px] rounded-xl border border-border/70 bg-muted/45 p-1.5 overflow-hidden shrink-0">
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
                  className="relative min-w-0 min-h-0 rounded-lg overflow-hidden bg-muted group"
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
                      <span className="text-muted-foreground text-xs truncate w-full">{file.name}</span>
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
            className="p-3 rounded-full border border-border/70 text-muted-foreground hover:bg-muted/50 disabled:opacity-50 transition-colors"
            aria-label="Attach files"
          >
            <Paperclip size={20} />
          </button>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Напишите сообщение..."
            className="flex-1 p-3 text-foreground border border-border/70 bg-card/90 rounded-full focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !attachedFiles.length) || sending}
            className="p-3 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 transition-colors shadow-sm"
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