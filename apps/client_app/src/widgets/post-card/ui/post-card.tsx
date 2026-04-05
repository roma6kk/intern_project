'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import type { Post } from '@/entities/post';
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark, Edit2, Trash2, Volume2, VolumeX, ArchiveRestore, Archive, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/entities/session';
import { togglePostLike, getPostLikes, deletePost, archivePost } from '@/entities/post';
import {
  CommentItem,
  createComment,
  getPostComments,
  getCommentLikes,
  getCommentReplies,
  type Comment,
} from '@/entities/comment';
import { MentionTextarea } from '@/shared/ui/mention-textarea';
import { MentionText } from '@/shared/ui/mention-text';
import { SharePostModal } from '@/features/post-share';
import { EditPostModal } from '@/features/post-edit';
import { ReportPostModal } from '@/features/post-report';
import { createReport } from '@/entities/report';
import { cn } from '@/shared/lib/cn';
import surface from '@/shared/styles/surface.module.css';
import animations from '@/shared/styles/animations.module.css';

function timeAgo(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export function PostCard({ post, fullView = false }: { post: Post; fullView?: boolean }) {
  const { user } = useAuth();
  const [showFull, setShowFull] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const articleRef = useRef<HTMLElement | null>(null);
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isArchived, setIsArchived] = useState(post.isArchived);
  const [isArchiving, setIsArchiving] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    if (!post.id || !user?.id) return;

    const loadData = async () => {
      try {
        const likes = await getPostLikes(post.id);
        setLikesCount(likes.length);
        
        const userLiked = likes.some((like: { author?: { id?: string } }) => like.author?.id === user.id);
        setLiked(userLiked);

      } catch {}
    };

    loadData();
  }, [post.id, user?.id]);

 const handleArchivePost = async () => {
  if (isArchiving || !post.id) return;

  setIsArchiving(true);
  try {
    const updatedPost = await archivePost(post.id);
    
    setIsArchived(updatedPost.isArchived);
    setShowMenu(false);
    
  } catch (error) {
    console.error('Failed to archive post:', error);
    alert('Failed to update archive status');
  } finally {
    setIsArchiving(false);
  }
};

  const processComments = useCallback(async (rawComments: Comment[]) => {
    return await Promise.all(
      rawComments.map(async (comment) => {
        try {
          const commentLikes = await getCommentLikes(comment.id);
          const author = comment.author || { id: comment.authorId };
          const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
          return {
            ...comment,
            author: { ...author, id: author.id || comment.authorId, username, profile: author.profile || {} },
            likesCount: commentLikes.length,
            liked: commentLikes.some((l: { author?: { id?: string } }) => l.author?.id === user?.id)
          };
        } catch {
          return comment;
        }
      })
    );
  }, [user?.id]);

  const loadPreviewComments = useCallback(async () => {
    try {
      const res = await getPostComments(post.id, 1, 3);
      const processed = await processComments(res.data || []);
      setComments(processed);
      setCommentsCount(res.meta.total);
    } catch {}
  }, [post.id, processComments]);

  useEffect(() => {
    setComments([]);
    setCommentsPage(1);
    setCommentsHasMore(true);
    if (!fullView && post.id) {
      loadPreviewComments();
   }
 }, [post.id, fullView, loadPreviewComments]);

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
    setCurrentAssetIndex(0);
  }, [post.assets]);
  
  const loadMoreComments = useCallback(async () => {
    if (!post.id || commentsLoading || !commentsHasMore) return;
  
    setCommentsLoading(true);
    try {
      const res = await getPostComments(post.id, commentsPage, 20);
      const newComments = await processComments(res.data || []);
  
      setComments(prev => {
        const map = new Map(prev.map(c => [c.id, c]));
        newComments.forEach(c => map.set(c.id, c));
        return Array.from(map.values());
      });
  
      setCommentsHasMore(comments.length + newComments.length < res.meta.total);
      setCommentsPage(p => p + 1);
      setCommentsCount(res.meta.total);
    } catch {}
    setCommentsLoading(false);
  }, [post.id, commentsPage, commentsHasMore, commentsLoading, comments.length, processComments]);

  useEffect(() => {
    if (fullView && commentsPage === 1 && comments.length === 0) {
      loadMoreComments();
    }
  }, [fullView, loadMoreComments, commentsPage, comments.length]);
  
  

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

  const handleDeletePost = async () => {
    if (!post.id || isDeleting) return;
    
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      setShowMenu(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
      setIsDeleting(false);
    }
  };

  const handleReportPost = async () => {
    if (!post.id || isReporting || !user?.id) return;
    if (reportReason.trim().length < 5) {
      alert('Please provide at least 5 characters in reason');
      return;
    }
    setIsReporting(true);
    try {
      await createReport({
        postId: post.id,
        reason: reportReason.trim(),
      });
      setShowReportModal(false);
      setReportReason('');
      setShowMenu(false);
      alert('Report submitted');
    } catch (error) {
      console.error('Failed to report post:', error);
      alert('Failed to submit report');
    } finally {
      setIsReporting(false);
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

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => {
      const removeComment = (list: Comment[]): Comment[] => {
        return list.filter(c => c.id !== commentId).map(c => {
          if (c.replies && c.replies.length > 0) {
            return { ...c, replies: removeComment(c.replies) };
          }
          return c;
        });
      };
      return removeComment(prev);
    });
  };

  const handleCommentUpdated = (commentId: string, content: string) => {
    setComments(prev => {
      const updateComments = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content };
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
            return reply;
          }
        })
      );
      
      setComments(prev => {
        const updateRecursive = (list: Comment[]): Comment[] => {
          return list.map(c => {
            if (c.id === commentId) {
              return { ...c, replies: repliesWithLikes };
            }
            if (c.replies && c.replies.length > 0) {
              return { ...c, replies: updateRecursive(c.replies) };
            }
            return c;
          });
        };

        return updateRecursive(prev);
      });
    } catch (e) {
      console.error('Failed to load replies', e);
    }
  };

  const descShort = useMemo(() => {
    if (!post.description) return '';
    return post.description.length > 120 ? post.description.slice(0, 120) + '...' : post.description;
  }, [post.description]);

  return (
    <>
      <article
        className={cn(surface.card, animations.slideUp, animations.hoverLift, 'p-3 sm:p-4 rika-glow-edge overflow-hidden')}
        ref={articleRef}
      >
        <header className="flex items-center mb-3">
          <button
            onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
            className="shrink-0 mr-3 w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/25"
          >
            <Image
              src={post.author?.profile?.avatarUrl || '/default-avatar.svg'}
              alt={post.author?.username || 'avatar'}
              width={40}
              height={40}
              className="w-full h-full object-cover hover:opacity-80 transition-opacity"
            />
          </button>
          <div className="flex-1">
            <button
              onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
            className="font-semibold text-foreground hover:underline"
            >
              {post.author?.username || 'Unknown'}
            </button>
            <div className="text-xs text-muted-foreground">{post.author?.profile?.firstName || ''}</div>
          </div>
  
          {user?.id && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-xl hover:bg-muted active:bg-muted transition-colors"
              >
                <MoreHorizontal size={18} className="text-muted-foreground" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-popover/98 text-popover-foreground border border-border rounded-2xl shadow-lg z-10 min-w-[170px] overflow-hidden backdrop-blur-md">
                  {user?.id === post.author?.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Edit
                      </button>

                      <button
                        onClick={handleArchivePost}
                        disabled={isArchiving}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 disabled:opacity-50"
                      >
                        {isArchiving ? (
                          <span className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                        ) : isArchived ? (
                          <>
                            <ArchiveRestore size={16} /> Unarchive
                          </>
                        ) : (
                          <>
                            <Archive size={16} /> Archive
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDeletePost}
                        disabled={isDeleting}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 size={16} /> {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2"
                    >
                      <Flag size={16} /> Report
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </header>

        {isArchived && fullView && (
            <div className="bg-yellow-50 text-yellow-800 text-sm px-4 py-2 flex items-center gap-2 border-b border-yellow-100">
                <Archive size={16} />
                This post is archived and only visible to you.
            </div>
        )}
  
        {post.assets && post.assets.length > 0 && (
          <div 
            className="relative w-full bg-black rounded-2xl overflow-hidden group border border-border/40"
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
                      className="w-full max-h-[72vh] object-contain h-auto"
                      muted={isMuted}
                      loop
                    />
                  ) : (
                    <Image
                      key={asset.url}
                      src={asset.url}
                      alt={'post'}
                      width={600}
                      height={400}
                      className="w-full h-auto max-h-[72vh] object-contain transition-transform duration-700 group-hover:scale-[1.015]"
                    />
                  )}
  
                  {post.assets.length > 1 && (
                    <>
                      <button
                        onClick={goToPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/70 text-white rounded-xl p-2 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/70 text-white rounded-xl p-2 transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
  
                  {post.assets.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 rounded-full px-2 py-1 backdrop-blur-sm">
                      {post.assets.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAssetIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            index === currentAssetIndex 
                              ? 'bg-card w-6' 
                              : 'bg-card bg-opacity-50 hover:bg-opacity-75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
  
                  {isVideo && (
                    <button
                      onClick={handleToggleMute}
                      className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/75 text-white rounded-xl p-2 transition-all backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {(!post.assets || post.assets.length === 0) && post.description && (
          <div className="mt-3 mb-3 px-4 py-3 bg-muted/45 rounded-2xl border border-border/80">
            <p className="text-base text-foreground leading-relaxed">
              <button
                onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                className="font-semibold mr-2 hover:underline text-muted-foreground"
              >
                {post.author?.username || 'Unknown'}
              </button>
              <MentionText text={showFull ? post.description : descShort} />
              {post.description.length > 120 && (
                <button className="ml-2 text-sm text-primary hover:text-primary/80 transition-colors" onClick={() => setShowFull(s => !s)}>
                  {showFull ? 'less' : 'more'}
                </button>
              )}
            </p>
          </div>
        )}
  
        <div className="flex items-center justify-between mt-3 mb-2 p-1.5 rounded-2xl bg-background/45 border border-border/50">
          <div className="flex items-center gap-4">
            <button
              onClick={async () => {
                if (!post.id || isLiking) return;
                if (!user) return (window.location.href = '/login');
                setIsLiking(true);
                try {
                  const res = await togglePostLike(post.id);
                  const nowLiked = res.liked === true;
                  setLiked(nowLiked);
                  setLikesCount((c) => (nowLiked ? (c || 0) + 1 : Math.max((c || 0) - 1, 0)));
                } finally { setIsLiking(false); }
              }}
              className="p-2 rounded-xl hover:bg-muted transition"
            >
              <Heart size={24} className={liked ? 'text-red-500 fill-red-500' : 'text-foreground'} />
            </button>

            <button
              onClick={() => {
                const el = document.querySelector<HTMLTextAreaElement>(`#comment-input-${post.id}`);
                el?.focus();
              }}
              className="p-2 rounded-xl hover:bg-muted transition"
            >
              <MessageCircle size={24} className="text-foreground" />
            </button>

            <button
                aria-label="Send"
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-xl hover:bg-muted active:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <Send size={24} className="text-foreground" />
              </button>
            </div>

          <button className="p-2 rounded-xl hover:bg-muted transition">
            <Bookmark size={20} className="text-foreground" />
          </button>
        </div>

  
        {/* Likes & Description for posts with media */}
        {post.assets && post.assets.length > 0 && (
          <>
            {likesCount > 0 && <div className="text-sm font-semibold text-muted-foreground mb-1">{likesCount} likes</div>}
  
            {post.description && (
              <div className="text-sm text-foreground mb-2">
                <button
                  onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                  className="font-semibold mr-2 hover:underline text-muted-foreground"
                >
                  {post.author?.username || 'Unknown'}
                </button>
                <MentionText text={showFull ? post.description : descShort} />
                {post.description.length > 120 && (
                  <button className="ml-2 text-sm text-primary hover:text-primary/80 transition-colors" onClick={() => setShowFull(s => !s)}>
                    {showFull ? 'less' : 'more'}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Likes count for posts without media */}
        {(!post.assets || post.assets.length === 0) && likesCount > 0 && (
          <div className="text-sm font-semibold text-muted-foreground mb-1">{likesCount} likes</div>
        )}
  
        {/* Comments */}
        <div className="space-y-2 mb-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={post.id}
              onReplyAdded={handleReplyAdded}
              onLikeToggle={handleCommentLikeToggle}
              onCommentDeleted={handleCommentDeleted}
              onCommentUpdated={handleCommentUpdated}
              onLoadReplies={handleLoadReplies}
            />
          ))}
        </div>
        {!fullView && commentsCount > comments.length && (
          <Link
            href={`/post/${post.id}`}
            className="inline-flex text-sm font-medium text-primary hover:text-primary/80 transition-colors mb-2"
          >
            Показать все комментарии ({commentsCount})
          </Link>
        )}
  
        {/* Add Comment */}
        <div className="pt-3 mt-2 border-t border-border/70 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <Image
              src={user?.profile?.avatarUrl || '/default-avatar.svg'}
              alt="you"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <MentionTextarea
              value={commentText}
              onChange={setCommentText}
              placeholder="Add a comment... (use @ to mention)"
              className="flex-1 text-sm bg-muted/80 text-foreground placeholder:text-muted-foreground px-3 py-2.5 rounded-2xl border border-border resize-none min-h-[42px] mb-1 box-border focus:outline-none focus:ring-2 focus:ring-primary/25"
              inputId={`comment-input-${post.id}`}
            />
            <button
              onClick={async () => {
                if (!commentText?.trim() || isPublishing) return;
                if (!user) return (window.location.href = '/login');
                setIsPublishing(true);
                try {
                  const newComment = await createComment({ postId: post.id, content: commentText.trim() });
                  const author = newComment.author || { id: newComment.authorId };
                  const username = author.username || author?.account?.username || author?.profile?.firstName || 'Unknown';
                  const profile = author.profile || {};
                  const normalizedComment = { ...newComment, author: { ...author, id: author.id || newComment.authorId, username, profile } };
                  setCommentText('');
                  setComments(prev => [normalizedComment, ...prev]);
                } finally { setIsPublishing(false); }
              }}
              disabled={!commentText?.trim() || isPublishing}
              className="self-end mt-1 text-sm text-primary font-semibold px-3 py-1 rounded-lg hover:bg-primary/10 active:bg-primary/15 transition disabled:opacity-50"
            >
              {isPublishing ? 'Posting...' : 'Publish'}
            </button>
          </div>
        </div>
  
        <div className="text-xs text-muted-foreground mt-2">{timeAgo(post.createdAt)} ago</div>
      </article>
      {showShareModal && (
        <SharePostModal 
          postId={post.id} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
      <EditPostModal post={post} open={showEditModal} onClose={() => setShowEditModal(false)} />
      <ReportPostModal
        open={showReportModal}
        reportReason={reportReason}
        isReporting={isReporting}
        onReasonChange={setReportReason}
        onClose={() => {
          setShowReportModal(false);
          setReportReason('');
        }}
        onSubmit={handleReportPost}
      />
    </>
  );  
}
