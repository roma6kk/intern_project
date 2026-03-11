'use client';

import { useState } from 'react';
import { Heart, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import {
  createComment,
  toggleCommentLike,
  updateComment,
  deleteComment,
  type Comment,
} from '@/lib/services/comments.service';
import MentionTextarea from './MentionTextarea';
import MentionText from './MentionText';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplyAdded: (parentId: string, reply: Comment) => void;
  onLikeToggle: (commentId: string, liked: boolean, likesCount: number) => void;
  onCommentDeleted?: (commentId: string) => void;
  onCommentUpdated?: (commentId: string, content: string) => void;
  onLoadReplies?: (commentId: string) => void;
  level?: number;
}

export default function CommentItem({
  comment,
  postId,
  onReplyAdded,
  onLikeToggle,
  onCommentDeleted,
  onCommentUpdated,
  onLoadReplies,
  level = 0,
}: CommentItemProps) {
  const { user } = useAuth();
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
      const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
      const profile = author.profile || {};
      const normalizedReply = { ...reply, author: { ...author, id: author.id || reply.authorId, username, profile } };

      setReplyText('');
      setShowReplyInput(false);
      onReplyAdded(comment.id, normalizedReply);
    } catch (err) {
      console.error('Reply error:', err);
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
      console.error('Like error:', err);
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
      console.error('Edit comment error:', err);
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
      console.error('Delete comment error:', err);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const marginLeft = level * 24;

  return (
    <div
      className="relative"
      style={{ marginLeft: `${marginLeft}px`, marginTop: level > 0 ? '8px' : '0' }}
    >
      {level > 0 && (
        <div
          className="absolute border-l-2 border-gray-200"
          style={{ 
            left: '-12px', 
            top: '-8px', 
            bottom: '16px',
            borderBottomLeftRadius: '8px'
          }}
        />
      )}

      <div className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${level > 0 ? 'bg-gray-50/50' : ''}`}>
        <button
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
          <div className="text-gray-800 text-sm break-words">
            <button
              onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
              className="font-semibold hover:underline mr-1 text-gray-500"
            >
              {comment.author?.username || 'Unknown'}
            </button>
            {isEditing ? (
              <div className="mt-2 flex flex-col gap-2">
                <MentionTextarea
                  value={editText}
                  onChange={setEditText}
                  placeholder="Edit comment..."
                  className="flex-1 text-sm text-gray-500 bg-white border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-lg px-3 py-2 min-h-[60px]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditCancel}
                    className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSave}
                    disabled={!editText.trim() || editText === comment.content || isUpdating}
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <MentionText text={comment.content} />
            )}
          </div>

          <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500 font-medium">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${liked ? 'text-red-500' : ''}`}
            >
              <Heart size={14} className={liked ? 'fill-red-500' : ''} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:text-gray-700 transition-colors"
            >
              Reply
            </button>

            {isOwnComment && !isEditing && (
              <>
                <button
                  onClick={() => {
                    setEditText(comment.content);
                    setIsEditing(true);
                  }}
                  className="hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                {showDeleteConfirm ? (
                  <span className="flex items-center gap-1">
                    <span className="text-red-600">Delete?</span>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-red-600 hover:underline font-medium"
                    >
                      {isDeleting ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="hover:text-gray-700"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                )}
              </>
            )}

            {(comment._count?.children ?? 0) > 0 && !hasLoadedReplies && (
              <button
                onClick={() => onLoadReplies?.(comment.id)}
                className="hover:text-blue-600 transition-colors"
              >
                View {comment._count?.children} replies
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
                  placeholder={`Reply to ${comment.author?.username}...`}
                  className="flex-1 text-sm text-gray-500 bg-white border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 rounded-lg px-3 py-2 min-h-[60px]"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => setShowReplyInput(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isReplying}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 transition-colors"
                  >
                    {isReplying ? 'Sending...' : 'Reply'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasLoadedReplies && (
        <div className="mt-2">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
              onLikeToggle={onLikeToggle}
              onCommentDeleted={onCommentDeleted}
              onCommentUpdated={onCommentUpdated}
              onLoadReplies={onLoadReplies}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}