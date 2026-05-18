'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Message } from '@/entities/chat';
import { useAuth } from '@/entities/session';
import { format } from 'date-fns';
import Image from 'next/image';
import { User, FileText, X, ChevronLeft, ChevronRight, Reply, Pencil, Trash2, Play } from 'lucide-react';
import { updateMessage, deleteMessage } from '@/entities/chat';
import PostSharePreview from './PostSharePreview';
import StoryMessagePreview, { parseStoryMeta } from './StoryMessagePreview';
import { extractPostIdFromText, stripPostLinks } from '@/shared/lib/post-link';
import { isVideoUrl } from '@/shared/lib/is-video-url';
import { StoryVideoThumb } from '@/features/stories/ui/story-video-thumb';
import { getMessagePreviewText } from '@/shared/lib/message-preview';

const ASSET_GRID_CLASS: Record<number, string> = {
  1: 'grid grid-cols-1',
  2: 'grid grid-cols-2 gap-0.5',
  3: 'grid grid-cols-2 gap-0.5 [&>a:first-child]:col-span-2',
  4: 'grid grid-cols-2 gap-0.5',
  5: 'grid grid-cols-6 gap-0.5 [&>a:nth-child(1)]:col-span-3 [&>a:nth-child(2)]:col-span-3 [&>a:nth-child(3)]:col-span-2 [&>a:nth-child(4)]:col-span-2 [&>a:nth-child(5)]:col-span-2',
  6: 'grid grid-cols-3 gap-0.5',
  7: 'grid grid-cols-4 gap-0.5 [&>a:nth-child(7)]:col-span-2',
  8: 'grid grid-cols-4 gap-0.5',
  9: 'grid grid-cols-3 gap-0.5',
  10: 'grid grid-cols-5 gap-0.5',
};

type ImageAsset = { id: string; url: string; type?: string };

function assetIsVideo(asset: ImageAsset): boolean {
  const t = (asset.type ?? '').toUpperCase();
  const result = t === 'VIDEO' || isVideoUrl(asset.url);
  // #region agent log
  fetch('http://127.0.0.1:7831/ingest/bad0d17b-1179-4cce-8537-b37e235c7b74',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'c3b88c'},body:JSON.stringify({sessionId:'c3b88c',runId:'pre-fix',hypothesisId:'H2',location:'MessageBubble.tsx:assetIsVideo',message:'Classify asset as video',data:{assetType:asset.type ?? null,urlHasVideoExt:isVideoUrl(asset.url),result},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  return result;
}

function assetIsImage(asset: ImageAsset): boolean {
  return !assetIsVideo(asset);
}

function ImageGalleryModal({
  images,
  initialIndex,
  onClose,
}: {
  images: ImageAsset[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const n = images.length;
  const goPrev = useCallback(() => setIndex((i) => (i - 1 + n) % n), [n]);
  const goNext = useCallback(() => setIndex((i) => (i + 1) % n), [n]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (n === 0) return null;
  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр изображения"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-card/10 transition-colors"
        aria-label="Закрыть"
      >
        <X size={28} />
      </button>

      <div
        className="relative flex items-center justify-center w-full h-full max-w-5xl mx-auto px-14 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        {n > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-card/10 transition-colors"
            aria-label="Предыдущее"
          >
            <ChevronLeft size={36} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.url}
          alt=""
          className="max-w-full max-h-full object-contain select-none"
          draggable={false}
          onClick={(e) => e.stopPropagation()}
        />

        {n > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-card/10 transition-colors"
            aria-label="Следующее"
          >
            <ChevronRight size={36} />
          </button>
        )}

        {n > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-sm">
            {index + 1} / {n}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoPlayerModal({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр видео"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-card/10 transition-colors"
        aria-label="Закрыть"
      >
        <X size={28} />
      </button>
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl border border-border/70 bg-card/70 p-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-xl bg-black">
          <video
            src={src}
            controls
            autoPlay
            playsInline
            className="w-full max-h-[75vh] bg-black"
          />
        </div>
      </div>
    </div>
  );
}

function MessageAssets({
  assets,
  isOwn,
  hasTextAbove,
  onImageClick,
  onVideoClick,
}: {
  assets: ImageAsset[];
  isOwn: boolean;
  hasTextAbove?: boolean;
  onImageClick?: (index: number) => void;
  onVideoClick?: (url: string) => void;
}) {
  const images = assets.filter((a) => assetIsImage(a));
  const videos = assets.filter((a) => assetIsVideo(a));
  const files = assets.filter((a) => {
    const t = (a.type ?? '').toUpperCase();
    if (t === 'IMAGE' || t === 'VIDEO') return false;
    // Unknown/legacy assets are treated as image/video tiles, not as "file chips".
    if (!a.type) return false;
    return !assetIsImage(a) && !assetIsVideo(a);
  });
  const media = [...images, ...videos];
  const n = media.length;
  const gridClass = n > 0 ? ASSET_GRID_CLASS[n as keyof typeof ASSET_GRID_CLASS] ?? 'grid grid-cols-2 gap-0.5' : '';

  const edgeToEdgeMedia = !hasTextAbove && n > 0;

  return (
    <div className={`${edgeToEdgeMedia ? '-mt-3' : 'mt-2'} space-y-2`}>
      {n > 0 && (
        <div
          className={`overflow-hidden ${
            edgeToEdgeMedia
              ? `w-full rounded-t-2xl ${isOwn ? 'rounded-tr-2xl' : 'rounded-tl-2xl'}`
              : 'w-full rounded-xl'
          } ${gridClass}`}
        >
          {media.map((asset) => {
            const isVideo = assetIsVideo(asset);
            if (isVideo) {
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onVideoClick?.(asset.url)}
                  className="relative block aspect-square min-h-[80px] bg-muted w-full h-full cursor-pointer border-0 p-0 text-left"
                >
                  <StoryVideoThumb src={asset.url} />
                  <span className="absolute bottom-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/55 text-white">
                    <Play size={14} className="ml-0.5" />
                  </span>
                </button>
              );
            }
            const imageIndex = images.findIndex((img) => img.id === asset.id);
            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => {
                  if (imageIndex >= 0) onImageClick?.(imageIndex);
                }}
                className="block aspect-square min-h-[80px] bg-muted w-full h-full cursor-pointer border-0 p-0 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none"
                />
              </button>
            );
          })}
        </div>
      )}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {files.map((asset) => (
            <a
              key={asset.id}
              href={asset.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isOwn ? 'bg-blue-500/80 text-white' : 'bg-muted text-foreground'}`}
            >
              <FileText size={14} />
              Открыть файл
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

const MAX_ATTACHMENTS = 10;

export default function MessageBubble({
  message,
  onReply,
}: {
  message: Message;
  onReply?: () => void;
}) {
  const { user } = useAuth();
  const isOwn = message.senderId === user?.id;
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content ?? '');
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const messageImages = (message.assets ?? []).filter((a) => assetIsImage(a));
  const hasAssets = (message.assets?.length ?? 0) > 0;
  const sharedPostId = extractPostIdFromText(message.content);
  const messageTextWithoutPostLink = stripPostLinks(message.content);
  const hasVisibleText = Boolean(
    message.content &&
      ((!sharedPostId && (message.content?.length ?? 0) > 0) ||
        Boolean(sharedPostId && messageTextWithoutPostLink.length > 0)),
  );
  const storyMeta = parseStoryMeta(message.content);
  const replySharedPostId = extractPostIdFromText(message.replyTo?.content);

  const handleSaveEdit = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateMessage(
        message.id,
        { content: editText.trim() || undefined },
        editFiles.length > 0 ? editFiles : undefined,
      );
      setIsEditing(false);
      setEditText(message.content ?? '');
      setEditFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setConfirmingDelete(false);
    setDeleting(true);
    try {
      await deleteMessage(message.id);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  const showActions = isOwn && !message.deletedAt;

  return (
    <div className={`group flex w-full mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
          {message.sender.profile?.avatarUrl ? (
            <Image 
              src={message.sender.profile.avatarUrl} 
              alt="avatar" 
              width={32} 
              height={32} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <User size={16} />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`overflow-hidden p-3 rounded-2xl text-sm shadow-[0_8px_24px_-16px_var(--overlay)] ${
            isOwn 
              ? 'bg-primary text-white rounded-br-none border border-primary/55' 
              : 'bg-card border border-border/70 text-foreground rounded-bl-none'
          }`}
        >
          {!isOwn && (
             <div className="text-xs text-muted-foreground font-semibold mb-1">
                {message.sender.account?.username}
             </div>
          )}
          {message.replyTo && (
            <div
              className={`mb-2 pl-2 border-l-2 text-xs truncate max-w-full ${
                isOwn ? 'border-white/40 text-blue-100' : 'border-border text-muted-foreground'
              }`}
            >
              <span className="font-medium">
                {message.replyTo.sender?.account?.username ?? message.replyTo.sender?.profile?.firstName ?? 'User'}
              </span>
              <span className="ml-1">
                {message.replyTo.deletedAt
                  ? 'Message deleted'
                  : replySharedPostId
                    ? ''
                  : (() => {
                      const preview = getMessagePreviewText({
                        content: message.replyTo?.content,
                        deletedAt: message.replyTo?.deletedAt,
                        assetsCount: message.replyTo?.assets?.length,
                      });
                      return preview.length > 80 ? `${preview.slice(0, 80)}…` : preview;
                    })()}
              </span>
              {replySharedPostId && (
                <div className="mt-1 max-w-[220px]">
                  <PostSharePreview postId={replySharedPostId} />
                </div>
              )}
            </div>
          )}
          {message.deletedAt ? (
            <p className="italic opacity-80">
              Message deleted
            </p>
          ) : isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className={`w-full resize-none rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                  isOwn
                    ? 'border-white/35 bg-white/15 text-white placeholder-blue-100/70'
                    : 'border-border bg-muted/50 text-foreground'
                }`}
                placeholder="Текст сообщения..."
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className={`cursor-pointer rounded-lg border px-2 py-1 text-xs ${isOwn ? 'border-blue-400/50 text-blue-100' : 'border-border text-muted-foreground'}`}>
                  Заменить медиа ({editFiles.length}/{MAX_ATTACHMENTS})
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => {
                      const chosen = Array.from(e.target.files ?? []);
                      e.target.value = '';
                      setEditFiles((prev) => [...prev, ...chosen].slice(0, MAX_ATTACHMENTS));
                    }}
                  />
                </label>
                {editFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setEditFiles([])}
                    className="text-xs underline opacity-80"
                  >
                    Сбросить
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={saving}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? '…' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(message.content ?? '');
                    setEditFiles([]);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs ${isOwn ? 'bg-white/20 text-blue-100' : 'bg-muted text-foreground'}`}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              {!message.deletedAt && !isEditing && storyMeta ? (
                <StoryMessagePreview meta={storyMeta} isOwn={isOwn} />
              ) : (
                <>
                  {message.content &&
                    ((!sharedPostId && message.content.length > 0) ||
                      (sharedPostId && messageTextWithoutPostLink.length > 0)) && (
                      <p
                        className={`whitespace-pre-wrap ${
                          hasAssets
                            ? `mb-2 pb-2 border-b ${isOwn ? 'border-white/25' : 'border-border/70'}`
                            : ''
                        }`}
                      >
                        {sharedPostId ? messageTextWithoutPostLink : message.content}
                      </p>
                    )}
                  {!message.deletedAt && !isEditing && sharedPostId && (
                    <PostSharePreview postId={sharedPostId} />
                  )}
                </>
              )}
              {message.assets && message.assets.length > 0 && (
                <MessageAssets
                  assets={message.assets}
                  isOwn={isOwn}
                  hasTextAbove={hasVisibleText}
                  onImageClick={messageImages.length > 0 ? (i) => setGalleryIndex(i) : undefined}
                  onVideoClick={(url) => setActiveVideoUrl(url)}
                />
              )}
              {message.isEdited && (
                <div className={`text-[10px] mt-0.5 ${isOwn ? 'text-blue-100/90' : 'text-muted-foreground'}`}>
                  edited
                </div>
              )}
            </>
          )}
          {galleryIndex !== null && messageImages.length > 0 && !message.deletedAt && (
            <ImageGalleryModal
              images={messageImages}
              initialIndex={galleryIndex}
              onClose={() => setGalleryIndex(null)}
            />
          )}
          {activeVideoUrl && !message.deletedAt && (
            <VideoPlayerModal src={activeVideoUrl} onClose={() => setActiveVideoUrl(null)} />
          )}
          <div className="mt-1 flex items-center justify-end gap-1">
            {onReply && !message.deletedAt && (
              <button
                type="button"
                onClick={onReply}
                className={`rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isOwn ? 'text-blue-100 hover:bg-white/20' : 'text-muted-foreground hover:bg-muted'
                }`}
                aria-label="Ответить"
              >
                <Reply size={14} />
              </button>
            )}
            {showActions && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwn ? 'text-blue-100 hover:bg-white/20' : 'text-muted-foreground hover:bg-muted'
                  }`}
                  aria-label="Изменить"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  disabled={deleting}
                  className={`rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwn ? 'text-blue-100 hover:bg-white/20' : 'text-muted-foreground hover:bg-muted'
                  } disabled:opacity-50`}
                  aria-label="Удалить"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <span className={`text-[10px] ${isOwn ? 'text-blue-100/90' : 'text-muted-foreground'}`}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
      {confirmingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4"
          onClick={() => {
            if (!deleting) setConfirmingDelete(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Подтверждение удаления сообщения"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-foreground">Удалить сообщение?</h3>
            <p className="mt-1 text-xs text-muted-foreground">Это действие нельзя отменить.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                disabled={deleting}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-destructive px-3 py-1.5 text-xs text-destructive-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? 'Удаляем…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}