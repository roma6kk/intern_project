'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message } from '@/types/index';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import Image from 'next/image';
import { User, FileText, X, ChevronLeft, ChevronRight, Reply, Pencil, Trash2 } from 'lucide-react';
import { updateMessage, deleteMessage } from '@/lib/services/chat.service';

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
        className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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

function MessageAssets({
  assets,
  isOwn,
  onImageClick,
}: {
  assets: ImageAsset[];
  isOwn: boolean;
  onImageClick?: (index: number) => void;
}) {
  const images = assets.filter((a) => a.type === 'IMAGE' || !a.type);
  const files = assets.filter((a) => a.type && a.type !== 'IMAGE');
  const n = images.length;
  const gridClass = n > 0 ? ASSET_GRID_CLASS[n as keyof typeof ASSET_GRID_CLASS] ?? 'grid grid-cols-2 gap-0.5' : '';
  const maxWidthClass = n >= 6 ? 'max-w-[320px]' : 'max-w-[280px]';

  return (
    <div className="mt-2 space-y-2">
      {n > 0 && (
        <div
          className={`overflow-hidden rounded-xl border ${maxWidthClass} ${isOwn ? 'border-blue-500/30' : 'border-gray-200'} ${gridClass}`}
        >
          {images.map((asset, i) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onImageClick?.(i)}
              className="block aspect-square min-h-[80px] bg-gray-100 w-full h-full cursor-pointer border-0 p-0 text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.url}
                alt=""
                className="w-full h-full object-cover pointer-events-none"
              />
            </button>
          ))}
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
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${isOwn ? 'bg-blue-500/80 text-white' : 'bg-gray-200 text-gray-700'}`}
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
  const messageImages = (message.assets ?? []).filter((a) => a.type === 'IMAGE' || !a.type);

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
    if (typeof window !== 'undefined' && !window.confirm('Удалить сообщение?')) return;
    if (deleting) return;
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
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {message.sender.profile?.avatarUrl ? (
            <Image 
              src={message.sender.profile.avatarUrl} 
              alt="avatar" 
              width={32} 
              height={32} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <User size={16} />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div 
          className={`p-3 rounded-2xl text-sm ${
            isOwn 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {!isOwn && (
             <div className="text-xs text-gray-500 font-semibold mb-1">
                {message.sender.account?.username}
             </div>
          )}
          {message.replyTo && (
            <div
              className={`mb-2 pl-2 border-l-2 text-xs truncate max-w-full ${
                isOwn ? 'border-blue-400/60 text-blue-100' : 'border-gray-300 text-gray-500'
              }`}
            >
              <span className="font-medium">
                {message.replyTo.sender?.account?.username ?? message.replyTo.sender?.profile?.firstName ?? 'User'}
              </span>
              <span className="ml-1">
                {message.replyTo.deletedAt
                  ? 'Сообщение удалено'
                  : message.replyTo.content != null && message.replyTo.content !== ''
                    ? message.replyTo.content.slice(0, 80) + (message.replyTo.content.length > 80 ? '…' : '')
                    : (message.replyTo.assets?.length ?? 0) > 0
                      ? `Фото (${message.replyTo.assets?.length})`
                      : '[без текста]'}
              </span>
            </div>
          )}
          {message.deletedAt ? (
            <p className="italic opacity-80">
              Сообщение удалено
            </p>
          ) : isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className={`w-full resize-none rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-1 ${
                  isOwn
                    ? 'border-blue-400/50 bg-blue-500/20 text-white placeholder-blue-200/70'
                    : 'border-gray-300 bg-gray-50 text-gray-800'
                }`}
                placeholder="Текст сообщения..."
              />
              <div className="flex flex-wrap items-center gap-2">
                <label className={`cursor-pointer rounded-lg border px-2 py-1 text-xs ${isOwn ? 'border-blue-400/50 text-blue-100' : 'border-gray-300 text-gray-600'}`}>
                  Заменить картинки ({editFiles.length}/{MAX_ATTACHMENTS})
                  <input
                    type="file"
                    multiple
                    accept="image/*"
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
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
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
                  className={`rounded-lg px-3 py-1.5 text-xs ${isOwn ? 'bg-blue-500/30 text-blue-100' : 'bg-gray-200 text-gray-700'}`}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              {message.content ? (
                <p className="whitespace-pre-wrap">{message.content}</p>
              ) : null}
              {message.assets && message.assets.length > 0 && (
                <MessageAssets
                  assets={message.assets}
                  isOwn={isOwn}
                  onImageClick={messageImages.length > 0 ? (i) => setGalleryIndex(i) : undefined}
                />
              )}
              {message.isEdited && (
                <div className={`text-[10px] mt-0.5 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                  изменено
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
          <div className="mt-1 flex items-center justify-end gap-1">
            {onReply && !message.deletedAt && (
              <button
                type="button"
                onClick={onReply}
                className={`rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                  isOwn ? 'text-blue-200 hover:bg-blue-500/30' : 'text-gray-400 hover:bg-gray-100'
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
                    isOwn ? 'text-blue-200 hover:bg-blue-500/30' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  aria-label="Изменить"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwn ? 'text-blue-200 hover:bg-blue-500/30' : 'text-gray-400 hover:bg-gray-100'
                  } disabled:opacity-50`}
                  aria-label="Удалить"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
            <span className={`text-[10px] ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
              {format(new Date(message.createdAt), 'HH:mm')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}