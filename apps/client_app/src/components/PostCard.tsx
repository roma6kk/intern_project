'use client';

import { useMemo, useState, useEffect } from 'react';
import { Post } from '@/types';
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { togglePostLike, getPostLikes } from '@/lib/services/likes.service';
import { createComment, getPostComments, getCommentLikes, getCommentReplies } from '@/lib/services/comments.service';
import type { Comment } from '@/lib/services/comments.service';
import CommentItem from './CommentItem';

function timeAgo(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post }: { post: Post }) {
  const { user } = useAuth();
  const [showFull, setShowFull] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // Load likes and comments data on mount
  useEffect(() => {
    if (!post.id || !user?.id) return;

    const loadData = async () => {
      try {
        // Load likes data
        const likes = await getPostLikes(post.id);
        setLikesCount(likes.length);
        
        // Check if user liked the post
        const userLiked = likes.some((like: { author?: { id?: string } }) => like.author?.id === user.id);
        setLiked(userLiked);

        // Load comments
        const commentsData = await getPostComments(post.id, 1, 5);
        const commentsWithLikes = await Promise.all(
          (commentsData.data || []).map(async (comment: Comment) => {
            try {
              const commentLikes = await getCommentLikes(comment.id);
              const author = comment.author || { id: comment.authorId };
              const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
              const profile = author.profile || {};
              
              return {
                ...comment,
                author: { ...author, id: author.id || comment.authorId, username, profile },
                likesCount: commentLikes.length,
                liked: commentLikes.some((like: { author?: { id?: string } }) => like.author?.id === user.id)
              };
            } catch {
              const author = comment.author || { id: comment.authorId };
              const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
              const profile = author.profile || {};
              return { ...comment, author: { ...author, id: author.id || comment.authorId, username, profile } };
            }
          })
        );
        setComments(commentsWithLikes);
        setCommentsCount(commentsData.pagination?.total || commentsData.data?.length || 0);
      } catch {
      }
    };

    loadData();
  }, [post.id, user?.id]);

  const handleReplyAdded = (parentId: string, reply: Comment) => {
    setComments(prev => {
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply]
            };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies)
            };
          }
          return comment;
        });
      };
      return updateComments(prev);
    });
    setCommentsCount(c => c + 1);
  };

  const handleCommentLikeToggle = (commentId: string, liked: boolean, likesCount: number) => {
    setComments(prev => {
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, liked, likesCount };
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: updateComments(comment.replies)
            };
          }
          return comment;
        });
      };
      return updateComments(prev);
    });
  };

  const handleLoadReplies = async (commentId: string) => {
    try {
      const repliesData = await getCommentReplies(commentId);
      const repliesWithLikes = await Promise.all(
        repliesData.map(async (reply: Comment) => {
          try {
            const replyLikes = await getCommentLikes(reply.id);
            const author = reply.author || { id: reply.authorId };
            const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
            const profile = author.profile || {};
            
            return {
              ...reply,
              author: { ...author, id: author.id || reply.authorId, username, profile },
              likesCount: replyLikes.length,
              liked: replyLikes.some((like: { author?: { id?: string } }) => like.author?.id === user?.id)
            };
          } catch {
            const author = reply.author || { id: reply.authorId };
            const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
            const profile = author.profile || {};
            return { ...reply, author: { ...author, id: author.id || reply.authorId, username, profile } };
          }
        })
      );
      
      setComments(prev => {
        const updateComments = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, replies: repliesWithLikes };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        };
        return updateComments(prev);
      });
    } catch {
    }
  };

  const descShort = useMemo(() => {
    if (!post.description) return '';
    return post.description.length > 120 ? post.description.slice(0, 120) + '...' : post.description;
  }, [post.description]);

  return (
    <article className="bg-white border rounded">
      <header className="flex items-center p-3">
        <button
          onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
          className="shrink-0 mr-3"
        >
          <Image
            src={post.author?.profile?.avatarUrl || '/default-avatar.svg'}
            alt={post.author?.username || 'avatar'}
            width={40}
            height={40}
            className="rounded-full object-cover hover:opacity-80 transition-opacity"
          />
        </button>
        <div className="flex-1">
          <button
            onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
            className="font-semibold text-sm text-gray-600 hover:underline"
          >
            {post.author?.username || 'Unknown'}
          </button>
          <div className="text-xs text-gray-500">{post.author?.profile?.firstName || ''}</div>
        </div>
        <button
          aria-label="More"
          className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <MoreHorizontal size={18} className="text-gray-600" />
        </button>
      </header>

      {post.assets?.[0] && (
        <div className="w-full bg-black">
          <Image 
            src={post.assets[0].url} 
            alt="post" 
            width={600}
            height={400}
            className="w-full max-h-[70vh] object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.parentElement?.remove();
            }}
          />
        </div>
      )}

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              aria-label="Like"
              onClick={async () => {
                if (!post.id || isLiking) return;
                if (!user) return (window.location.href = '/login');
                setIsLiking(true);
                try {
                  const res = await togglePostLike(post.id);
                  const nowLiked = res.liked === true;
                  setLiked(nowLiked);
                  setLikesCount((c) => (nowLiked ? (c || 0) + 1 : Math.max((c || 0) - 1, 0)));
                } catch {
                } finally {
                  setIsLiking(false);
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <Heart size={24} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'} />
            </button>

            <button
              aria-label="Comment"
              onClick={() => {
                const el = document.querySelector(`#comment-input-${post.id}`) as HTMLInputElement | null;
                el?.focus();
              }}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <MessageCircle size={24} className="text-gray-700" />
            </button>

            <button
              aria-label="Send"
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <Send size={24} className="text-gray-700" />
            </button>
          </div>

          <button
            aria-label="Bookmark"
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <Bookmark size={20} className="text-gray-700" />
          </button>
        </div>

        {likesCount > 0 && (
          <div className="text-sm font-semibold mb-1 text-gray-600">{likesCount} likes</div>
        )}

        {post.description && (
          <div className="text-sm text-gray-800 mb-2">
            <button
              onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
              className="font-semibold mr-2 hover:underline"
            >
              {post.author?.username || 'Unknown'}
            </button>
            <span>{showFull ? post.description : descShort}</span>
            {post.description.length > 120 && (
              <button className="ml-2 text-sm text-gray-500" onClick={() => setShowFull((s) => !s)}>
                {showFull ? 'less' : 'more'}
              </button>
            )}
          </div>
        )}

        {commentsCount > 0 && (
          <div className="text-sm text-gray-500 mb-2 cursor-pointer hover:text-gray-700">
            View all {commentsCount} comments
          </div>
        )}

        {/* Display first few comments */}
        {comments.length > 0 && (
          <div className="mb-3 space-y-2">
            {comments.slice(0, 3).map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={post.id}
                onReplyAdded={handleReplyAdded}
                onLikeToggle={handleCommentLikeToggle}
                onLoadReplies={handleLoadReplies}
              />
            ))}
          </div>
        )}

        <div className="text-xs text-gray-400 mb-3">{timeAgo(post.createdAt)} ago</div>

        <div className="pt-2 border-t flex items-center gap-3">
          <Image
            src={user?.profile?.avatarUrl || '/default-avatar.svg'}
            alt={user?.username || 'you'}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <input
            id={`comment-input-${post.id}`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none bg-gray-100 text-gray-600 placeholder:text-gray-400 px-3 py-2 rounded-full border border-transparent focus:border-gray-300"
          />
          <button
            onClick={async () => {
              if (!commentText.trim() || isPublishing) return;
              if (!user) return (window.location.href = '/login');
              setIsPublishing(true);
              try {
                const newComment = await createComment({
                  postId: post.id,
                  content: commentText.trim(),
                });
                const author = newComment.author || { id: newComment.authorId };
                const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
                const profile = author.profile || {};
                const normalizedComment = { ...newComment, author: { ...author, id: author.id || newComment.authorId, username, profile } };
                
                setCommentText('');
                setCommentsCount((c) => (c || 0) + 1);
                setComments((prev) => [normalizedComment, ...prev]);
              } catch {
              } finally {
                setIsPublishing(false);
              }
            }}
            disabled={!commentText.trim() || isPublishing}
            className="text-sm text-blue-500 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 active:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {isPublishing ? 'Posting...' : 'Publish'}
          </button>
        </div>
      </div>
    </article>
  );
}
