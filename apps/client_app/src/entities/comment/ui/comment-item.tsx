'use client';

import { useState, useEffect, useRef } from 'react';
import { Flag, Heart, Link2, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/entities/session';
import type { Comment } from '../model/types';
import {
  createComment,
  toggleCommentLike,
  updateComment,
  deleteComment,
} from '../api/comments-api';
import { MentionTextarea } from '@/shared/ui/mention-textarea';
import { MentionText } from '@/shared/ui/mention-text';
import { ReportModal } from '@/shared/ui/report-modal';
import { createReport } from '@/entities/report';
import { notify } from '@/shared/lib/notify';
import { cn } from '@/shared/lib/cn';

// С этого уровня глубины начинается плоская колонка
const MAX_VISUAL_REPLY_LEVEL = 8;
//margin относительно родителя
const REPLY_INDENT_PX = 24;

function commentAuthorUsername(c: Comment): string {
  return (
    c.author?.username ||
    c.author?.account?.username ||
    c.author?.profile?.firstName ||
    'Неизвестно'
  );
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplyAdded: (parentId: string, reply: Comment) => void;
  onLikeToggle: (commentId: string, liked: boolean, likesCount: number) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentUpdated?: (commentId: string, content: string) => void;
  onLoadReplies?: (commentId: string) => void;
  level?: number;
  /** Логин автора комментария, на который отвечают (для глубокой ветки — плоский список). */
  replyToUsername?: string | null;
  /** id комментария для подсветки (диплинк); снимается через onConsumeHighlight */
  highlightTargetId?: string | null;
  onConsumeHighlight?: () => void;
}

export function CommentItem({
  comment,
  postId,
  onReplyAdded,
  onLikeToggle,
  onCommentDeleted,
  onCommentUpdated,
  onLoadReplies,
  level = 0,
  replyToUsername = null,
  highlightTargetId = null,
  onConsumeHighlight,
}: CommentItemProps) {
  const { user } = useAuth();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const highlightConsumedRef = useRef(false);
  const highlightedUnread = Boolean(
    highlightTargetId && highlightTargetId === comment.id,
  );
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(comment.liked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  const isOwnComment = (comment.authorId || comment.author?.id) === user?.id;
  const hasLoadedReplies = comment.replies && comment.replies.length > 0;

  const handleReply = async () => {
    if (!replyText.trim() || isReplying || !user) return;
    setIsReplying(true);
    try {
      const reply = await createComment({
        postId,
        content: replyText.trim(),
        parentId: comment.id,
      });

      const author = reply.author || { id: reply.authorId };
      const username = author.username || author?.account?.username || author?.profile?.firstName || 'Неизвестно';
      const profile = author.profile || {};
      const normalizedReply = { ...reply, author: { ...author, id: author.id || reply.authorId, username, profile } };

      setReplyText('');
      setShowReplyInput(false);
      onReplyAdded(comment.id, normalizedReply);
    } catch (err) {
      console.error('Ошибка ответа:', err);
    } finally {
      setIsReplying(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || !user) return;
    setIsLiking(true);
    try {
      const res = await toggleCommentLike(comment.id);
      const nowLiked = res.liked === true;
      const newLikesCount = nowLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);
      setLiked(nowLiked);
      setLikesCount(newLikesCount);
      onLikeToggle(comment.id, nowLiked, newLikesCount);
    } catch (err) {
      console.error('Ошибка лайка:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEditSave = async () => {
    if (!editText.trim() || editText === comment.content || isUpdating || !user) return;
    setIsUpdating(true);
    try {
      await updateComment(comment.id, editText.trim());
      onCommentUpdated?.(comment.id, editText.trim());
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка редактирования комментария:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isDeleting || !user) return;
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      onCommentDeleted?.(comment.id);
    } catch (err) {
      console.error('Ошибка удаления комментария:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  useEffect(() => {
    highlightConsumedRef.current = false;
  }, [highlightedUnread]);

  useEffect(() => {
    if (!highlightedUnread || !onConsumeHighlight) return;
    const el = rowRef.current;
    if (!el) return;

    const consume = () => {
      if (highlightConsumedRef.current) return;
      highlightConsumedRef.current = true;
      onConsumeHighlight();
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting && e.intersectionRatio >= 0.28) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(consume, 2200);
        } else if (timer) {
          clearTimeout(timer);
        }
      },
      { threshold: [0, 0.15, 0.28, 0.5, 1] },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [highlightedUnread, onConsumeHighlight]);

  const copyCommentLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/post/${postId}?c=${encodeURIComponent(comment.id)}`;
    void navigator.clipboard.writeText(url).then(
      () => notify.success('Ссылка скопирована'),
      () => notify.error('Не удалось скопировать ссылку'),
    );
  };

  const handleReportComment = async () => {
    if (!comment.id || isReporting || !user?.id) return;
    if (reportReason.trim().length < 5) {
      notify.info('Укажите причину (минимум 5 символов)');
      return;
    }
    setIsReporting(true);
    try {
      await createReport({
        commentId: comment.id,
        reason: reportReason.trim(),
      });
      setShowReportModal(false);
      setReportReason('');
      notify.success('Жалоба отправлена');
    } catch (err) {
      console.error('Ошибка жалобы на комментарий:', err);
      notify.error('Не удалось отправить жалобу');
    } finally {
      setIsReporting(false);
    }
  };

  const isDeepFlatReply = Boolean(replyToUsername);
  // Раньше было level * шаг: при вложенных div отступы складывались (24+48+72…) и раздували карточку.
  const marginLeft =
    level === 0 || isDeepFlatReply ? 0 : REPLY_INDENT_PX;

  return (
    <div
      className="relative min-w-0 w-full max-w-full"
      style={{ marginLeft: `${marginLeft}px`, marginTop: level > 0 ? '8px' : '0' }}
    >
      {level > 0 && !isDeepFlatReply && (
        <div
          className="absolute border-l-2 border-border"
          style={{ 
            left: '-12px', 
            top: '-8px', 
            bottom: '16px',
            borderBottomLeftRadius: '8px'
          }}
        />
      )}

      <div
        ref={rowRef}
        id={`comment-${comment.id}`}
        className={cn(
          'flex min-w-0 w-full items-start gap-3 p-2 rounded-lg transition-colors',
          level > 0 ? 'bg-muted/40' : '',
          highlightedUnread &&
            'ring-2 ring-amber-500/90 ring-offset-2 ring-offset-background bg-amber-50/50 dark:bg-amber-950/25 shadow-md',
        )}
        onPointerDownCapture={() => {
          if (highlightedUnread && onConsumeHighlight && !highlightConsumedRef.current) {
            highlightConsumedRef.current = true;
            onConsumeHighlight();
          }
        }}
      >
        <button
          type="button"
          onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
          className="shrink-0 z-10 w-8 h-8 rounded-full overflow-hidden"
        >
          <Image
            src={comment.author?.profile?.avatarUrl || '/default-avatar.svg'}
            alt={comment.author?.username || 'commenter'}
            width={32}
            height={32}
            className="w-full h-full object-cover hover:opacity-80 transition-opacity"
          />
        </button>

        <div className="flex-1 min-w-0">
          {replyToUsername && (
            <div className="text-[11px] text-muted-foreground mb-1 leading-snug break-words">
              Ответ на{' '}
              <button
                type="button"
                onClick={() => {
                  window.location.href = `/profile/${encodeURIComponent(replyToUsername)}`;
                }}
                className="font-medium text-primary hover:underline"
              >
                @{replyToUsername}
              </button>
            </div>
          )}
          <div className="text-foreground text-sm break-words [overflow-wrap:anywhere]">
            <button
              type="button"
              onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
              className="font-semibold hover:underline mr-1 text-muted-foreground"
            >
              {comment.author?.username || 'Неизвестно'}
            </button>
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <MentionTextarea
                  value={editText}
                  onChange={setEditText}
                  placeholder="Редактировать комментарий..."
                  className="flex-1 text-sm text-muted-foreground bg-background border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 rounded-lg px-3 py-2 min-h-[60px]"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted rounded"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleEditSave}
                    disabled={!editText.trim() || editText === comment.content || isUpdating}
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                  >
                    {isUpdating ? 'Сохранение...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            ) : (
              <MentionText text={comment.content} />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground font-medium">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-foreground transition-colors ${liked ? 'text-red-500' : ''}`}
            >
              <Heart size={14} className={liked ? 'fill-red-500' : ''} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            <button
              type="button"
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:text-foreground transition-colors"
            >
              Ответить
            </button>

            <button
              type="button"
              onClick={() => void copyCommentLink()}
              className="hover:text-foreground transition-colors flex items-center gap-1"
              title="Скопировать ссылку на комментарий"
            >
              <Link2 size={12} />
              Ссылка
            </button>

            {user && !isOwnComment && !isEditing && (
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="hover:text-amber-700 transition-colors flex items-center gap-1"
              >
                <Flag size={12} />
                Пожаловаться
              </button>
            )}

            {isOwnComment && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditText(comment.content);
                    setIsEditing(true);
                  }}
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Pencil size={12} />
                  Редактировать
                </button>
                {showDeleteConfirm ? (
                  <span className="flex items-center gap-1">
                    <span className="text-red-600">Удалить?</span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 hover:underline font-medium"
                    >
                      {isDeleting ? '...' : 'Да'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="hover:text-foreground"
                    >
                      Нет
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Удалить
                  </button>
                )}
              </>
            )}

            {(comment._count?.children ?? 0) > 0 && !hasLoadedReplies && (
              <button
                type="button"
                onClick={() => onLoadReplies?.(comment.id)}
                className="hover:text-blue-600 transition-colors"
              >
                Показать ответов: {comment._count?.children}
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-3 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mt-1">
                <Image
                  src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                  alt="you"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <MentionTextarea
                  value={replyText}
                  onChange={setReplyText}
                  placeholder={`Ответить ${comment.author?.username}...`}
                  className="flex-1 text-sm text-muted-foreground bg-background border border-border focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 rounded-lg px-3 py-2 min-h-[60px]"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={() => setShowReplyInput(false)}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted rounded-md"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleReply}
                    disabled={!replyText.trim() || isReplying}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {isReplying ? 'Отправка...' : 'Ответить'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasLoadedReplies && (
        <div className="mt-2 min-w-0">
          {comment.replies!.map((reply) => {
            const nextLevel = level + 1;
            const parentName = commentAuthorUsername(comment);
            return (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
              onLikeToggle={onLikeToggle}
              onCommentDeleted={onCommentDeleted}
              onCommentUpdated={onCommentUpdated}
              onLoadReplies={onLoadReplies}
              level={nextLevel}
              replyToUsername={
                nextLevel >= MAX_VISUAL_REPLY_LEVEL ? parentName : undefined
              }
              highlightTargetId={highlightTargetId}
              onConsumeHighlight={onConsumeHighlight}
            />
            );
          })}
        </div>
      )}

      <ReportModal
        open={showReportModal}
        reportReason={reportReason}
        isReporting={isReporting}
        onReasonChange={setReportReason}
        onClose={() => {
          setShowReportModal(false);
          setReportReason('');
        }}
        onSubmit={() => void handleReportComment()}
        title="Пожаловаться на комментарий"
        placeholder="Опишите нарушение (не менее 5 символов)…"
        cancelLabel="Отмена"
        submitLabel="Отправить"
        submittingLabel="Отправка…"
      />
    </div>
  );
}
