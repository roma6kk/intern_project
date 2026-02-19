'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { Post } from '@/types';
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark, Edit2, Trash2, X, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { togglePostLike, getPostLikes } from '@/lib/services/likes.service';
import { createComment, getPostComments, getCommentLikes, getCommentReplies } from '@/lib/services/comments.service';
import { updatePost, deletePost } from '@/lib/services/posts.service';
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
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState<string>(post.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  // Intersection Observer for video autoplay/pause
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (articleRef.current) {
      observer.observe(articleRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // reset index when assets change
    setCurrentAssetIndex(0);
  }, [post.assets]);

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

  const handleEditPost = async () => {
    if (!editDescription.trim() || isEditing || !post.id) return;
    
    setIsEditing(true);
    try {
      const updatedPost = await updatePost(post.id, editDescription.trim());
      post.description = updatedPost.description;
      setShowEditModal(false);
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post.id || isDeleting) return;
    
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      setShowMenu(false);
      // Remove the post from the feed by triggering a page reload or callback
      // For now, we'll just hide it
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
      setIsDeleting(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!post.assets || post.assets.length <= 1) return;
    setCurrentAssetIndex(i => (i - 1 + post.assets!.length) % post.assets!.length);
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!post.assets || post.assets.length <= 1) return;
    setCurrentAssetIndex(i => (i + 1) % post.assets!.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current > 50) {
      setCurrentAssetIndex(i => (i - 1 + (post.assets?.length || 1)) % (post.assets?.length || 1));
    } else if (touchDeltaX.current < -50) {
      setCurrentAssetIndex(i => (i + 1) % (post.assets?.length || 1));
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
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
    <>
      <article className="bg-white border rounded" ref={articleRef}>
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
        
        {/* Menu button - only show if current user is the post author */}
        {user?.id === post.author?.id && (
          <div className="relative" ref={menuRef}>
            <button
              aria-label="More"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <MoreHorizontal size={18} className="text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-37.5">
                <button
                  onClick={() => {
                    setEditDescription(post.description || '');
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-t-lg"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {post.assets && post.assets.length > 0 && (
        <div
          className="w-full bg-black relative group overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {(() => {
            const asset = post.assets![currentAssetIndex];
            if (!asset) return null;
            const isVideo = asset.type === 'VIDEO' || !!asset.url.match(/\.(mp4|webm|ogg|mov)$/i);

            return (
              <>
                {isVideo ? (
                  <video
                    key={asset.url}
                    ref={videoRef}
                    src={asset.url}
                    className="w-full max-h-[70vh] object-contain h-auto"
                    muted={isMuted}
                    loop
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      target.parentElement?.remove();
                    }}
                  />
                ) : (
                  <Image
                    key={asset.url}
                    src={asset.url}
                    alt={'post'}
                    width={600}
                    height={400}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.parentElement?.remove();
                    }}
                  />
                )}

                {/* Sound toggle button for videos */}
                {isVideo && (
                  <button
                    onClick={handleToggleMute}
                    className="absolute bottom-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                )}

                {/* Prev / Next buttons */}
                {post.assets.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      aria-label="Prev"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 16.293a1 1 0 010 1.414l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L8.414 10l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd"/></svg>
                    </button>
                    <button
                      onClick={goToNext}
                      aria-label="Next"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.707 3.707a1 1 0 010-1.414l6 6a1 1 0 010 1.414l-6 6A1 1 0 018.121 16.12L13.879 10 8.12 4.121a1 1 0 01-.413-.414z" clipRule="evenodd"/></svg>
                    </button>
                  </>
                )}

                {/* Dots */}
                {post.assets.length > 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center gap-2">
                    {post.assets.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => { e.stopPropagation(); setCurrentAssetIndex(idx); }}
                        className={`w-2 h-2 rounded-full ${idx === currentAssetIndex ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Go to media ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            );
          })()}
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

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Post</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                disabled={isEditing || !editDescription.trim()}
                className="flex-1 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
