'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { createComment, toggleCommentLike, type Comment } from '@/lib/services/comments.service';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReplyAdded: (parentId: string, reply: Comment) => void;
  onLikeToggle: (commentId: string, liked: boolean, likesCount: number) => void;
  onLoadReplies?: (commentId: string) => void;
  level?: number;
}

export default function CommentItem({ 
  comment, 
  postId, 
  onReplyAdded, 
  onLikeToggle, 
  onLoadReplies,
  level = 0 
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(comment.liked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);

  const handleReply = async () => {
    if (!replyText.trim() || isReplying || !user) return;
    
    setIsReplying(true);
    try {
      const reply = await createComment({
        postId,
        content: replyText.trim(),
        parentId: comment.id,
      });
      
      // Normalize reply author data
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

  const marginLeft = level * 24;

  return (
    <div className="mb-3" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="flex items-start gap-2 text-sm">
        <button
          onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
          className="shrink-0"
        >
          <Image
            src={comment.author?.profile?.avatarUrl || '/default-avatar.svg'}
            alt={comment.author?.username || 'commenter'}
            width={24}
            height={24}
            className="rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        </button>
        
        <div className="flex-1">
          <div className="text-gray-700">
            <button
              onClick={() => window.location.href = `/profile/${comment.author?.username || 'unknown'}`}
              className="font-semibold hover:underline"
            >
              {comment.author?.username || 'Unknown'}
            </button>
            {' '}
            <span>{comment.content}</span>
          </div>
          
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-gray-700 ${liked ? 'text-red-500' : ''}`}
            >
              <Heart size={12} className={liked ? 'fill-red-500' : ''} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </button>
            
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:text-gray-700"
            >
              Reply
            </button>
            
            {comment._count?.children && comment._count.children > 0 && !comment.replies && (
              <button
                onClick={() => onLoadReplies?.(comment.id)}
                className="hover:text-gray-700 font-medium"
              >
                View {comment._count.children} replies
              </button>
            )}
          </div>
          
          {showReplyInput && (
            <div className="mt-2 flex items-center gap-2">
              <Image
                src={user?.profile?.avatarUrl || '/default-avatar.svg'}
                alt="you"
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add a reply..."
                className="flex-1 text-xs outline-none bg-gray-100 text-gray-600 placeholder:text-gray-400 px-2 py-1 rounded-full"
              />
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || isReplying}
                className="text-xs text-blue-500 font-semibold px-2 py-1 rounded hover:bg-blue-50 disabled:opacity-50"
              >
                {isReplying ? 'Posting...' : 'Post'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          onReplyAdded={onReplyAdded}
          onLikeToggle={onLikeToggle}
          onLoadReplies={onLoadReplies}
          level={level + 1}
        />
      ))}
    </div>
  );
}