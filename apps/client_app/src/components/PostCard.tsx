'use client';

import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { Post } from '@/types';
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark, Edit2, Trash2, X, Volume2, VolumeX, ArchiveRestore, Archive, ChevronLeft, ChevronRight, Upload } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { togglePostLike, getPostLikes } from '@/lib/services/likes.service';
import { createComment, getPostComments, getCommentLikes, getCommentReplies } from '@/lib/services/comments.service';
import { updatePost, deletePost, archivePost } from '@/lib/services/posts.service';
import type { Comment } from '@/lib/services/comments.service';
import CommentItem from './CommentItem';
import MentionTextarea from './MentionTextarea';
import MentionText from './MentionText';
import SharePostModal from './SharePostModal';

function timeAgo(date?: string) {
  if (!date) return '';
  const d = new Date(date);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function PostCard({ post, fullView = false }: { post: Post; fullView?: boolean }) {
  const { user } = useAuth();
  const [showFull, setShowFull] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasMore, setCommentsHasMore] = useState(true);
  const [, setCommentsCount] = useState<number>(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState(false);
  const [commentText, setCommentText] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [isArchived, setIsArchived] = useState(post.isArchived);
  const [isArchiving, setIsArchiving] = useState(false);
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);
  const [editFileTypes, setEditFileTypes] = useState<('image' | 'video')[]>([]);
  const [editCurrentIndex, setEditCurrentIndex] = useState(0);
  const [editAssetsToDelete, setEditAssetsToDelete] = useState<string[]>([]);
  const [editExistingAssets, setEditExistingAssets] = useState<Array<{ id: string; url: string; type?: string }>>(
    (post.assets || []).map(asset => ({ id: (asset as { id?: string }).id ?? asset.url, url: asset.url, type: asset.type }))
  );

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
        // Убираем дубликаты
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

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    const MAX_FILES = 10;
    const currentFileCount = editExistingAssets.length - editAssetsToDelete.length + editFiles.length;
    const remainingSlots = MAX_FILES - currentFileCount;
    
    if (remainingSlots <= 0) {
      alert(`Максимальное количество файлов: ${MAX_FILES}`);
      return;
    }

    const valid: File[] = [];
    const previewsArr: string[] = [];
    const typesArr: ('image' | 'video')[] = [];

    const filesToProcess = selected.slice(0, remainingSlots);
    if (selected.length > remainingSlots) {
      alert(`Можно добавить только ${remainingSlots} файл(ов). Остальные будут проигнорированы.`);
    }

    await Promise.all(filesToProcess.map(async (f) => {
      const isVideo = f.type.startsWith('video/');
      const isImage = f.type.startsWith('image/');
      if (!isVideo && !isImage) return;
      valid.push(f);
      typesArr.push(isVideo ? 'video' : 'image');
      previewsArr.push(await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.readAsDataURL(f);
      }));
    }));

    if (valid.length) {
      setEditFiles(prev => [...prev, ...valid]);
      setEditPreviews(prev => [...prev, ...previewsArr]);
      setEditFileTypes(prev => [...prev, ...typesArr]);
      setEditCurrentIndex(editPreviews.length);
    }
  };

  const handleDeleteExistingAsset = (assetId: string) => {
    if (editAssetsToDelete.includes(assetId)) {
      setEditAssetsToDelete(prev => prev.filter(id => id !== assetId));
    } else {
      setEditAssetsToDelete(prev => [...prev, assetId]);
    }
  };

  const handleDeleteNewFile = (index: number) => {
    const nextFiles = [...editFiles];
    const nextPreviews = [...editPreviews];
    const nextTypes = [...editFileTypes];
    nextFiles.splice(index, 1);
    nextPreviews.splice(index, 1);
    nextTypes.splice(index, 1);
    setEditFiles(nextFiles);
    setEditPreviews(nextPreviews);
    setEditFileTypes(nextTypes);
    setEditCurrentIndex(i => Math.max(0, Math.min(i, nextPreviews.length - 1)));
  };

  const handleEditPost = async () => {
    if (isEditing || !post.id) return;
    
    setIsEditing(true);
    try {
      const updatedPost = await updatePost(
        post.id,
        editDescription.trim(),
        editFiles.length > 0 ? editFiles : undefined,
        editAssetsToDelete.length > 0 ? editAssetsToDelete : undefined
      );
      post.description = updatedPost.description;
      post.assets = updatedPost.assets;
      setEditExistingAssets(
        (updatedPost.assets || []).map(asset => ({ id: (asset as { id?: string }).id ?? asset.url, url: asset.url, type: asset.type }))
      );
      setShowEditModal(false);
      setShowMenu(false);
      // Reset edit state
      setEditFiles([]);
      setEditPreviews([]);
      setEditFileTypes([]);
      setEditCurrentIndex(0);
      setEditAssetsToDelete([]);
      window.location.reload(); // Reload to show updated assets
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    } finally {
      setIsEditing(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditFiles([]);
    setEditPreviews([]);
    setEditFileTypes([]);
    setEditCurrentIndex(0);
    setEditAssetsToDelete([]);
    setEditDescription(post.description || '');
    setEditExistingAssets(post.assets || []);
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
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-3" ref={articleRef}>
        {/* Header */}
        <header className="flex items-center mb-3">
          <button
            onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
            className="shrink-0 mr-3 w-10 h-10 rounded-full overflow-hidden"
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
              className="font-semibold text-gray-500 hover:underline"
            >
              {post.author?.username || 'Unknown'}
            </button>
            <div className="text-xs text-gray-500">{post.author?.profile?.firstName || ''}</div>
          </div>
  
          {/* Menu */}
          {user?.id === post.author?.id && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition"
              >
                <MoreHorizontal size={18} className="text-gray-600" />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      setEditDescription(post.description || '');
                      setEditExistingAssets(
                        (post.assets || []).map(asset => ({ id: (asset as { id?: string }).id ?? asset.url, url: asset.url, type: asset.type }))
                      );
                      setEditFiles([]);
                      setEditPreviews([]);
                      setEditFileTypes([]);
                      setEditCurrentIndex(0);
                      setEditAssetsToDelete([]);
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>

                  <button
                    onClick={handleArchivePost}
                    disabled={isArchiving}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                  >
                    {isArchiving ? (
                      <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
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
  
        {/* Media */}
        {post.assets && post.assets.length > 0 && (
          <div 
            className="relative w-full bg-black rounded-lg overflow-hidden group"
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
                    />
                  ) : (
                    <Image
                      key={asset.url}
                      src={asset.url}
                      alt={'post'}
                      width={600}
                      height={400}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  )}
  
                  {/* Navigation arrows */}
                  {post.assets.length > 1 && (
                    <>
                      <button
                        onClick={goToPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={goToNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
  
                  {/* Dots indicator */}
                  {post.assets.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {post.assets.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAssetIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            index === currentAssetIndex 
                              ? 'bg-white w-6' 
                              : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
  
                  {isVideo && (
                    <button
                      onClick={handleToggleMute}
                      className="absolute bottom-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Description for posts without media - shown before actions */}
        {(!post.assets || post.assets.length === 0) && post.description && (
          <div className="mt-3 mb-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-base text-gray-800 leading-relaxed">
              <button
                onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                className="font-semibold mr-2 hover:underline text-gray-500"
              >
                {post.author?.username || 'Unknown'}
              </button>
              <MentionText text={showFull ? post.description : descShort} />
              {post.description.length > 120 && (
                <button className="ml-2 text-sm text-gray-500 hover:text-gray-700" onClick={() => setShowFull(s => !s)}>
                  {showFull ? 'less' : 'more'}
                </button>
              )}
            </p>
          </div>
        )}
  
        {/* Actions */}
        <div className="flex items-center justify-between mt-3 mb-2">
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
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Heart size={24} className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'} />
            </button>

            <button
              onClick={() => {
                const el = document.querySelector<HTMLTextAreaElement>(`#comment-input-${post.id}`);
                el?.focus();
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <MessageCircle size={24} className="text-gray-700" />
            </button>

            <button
                aria-label="Send"
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <Send size={24} className="text-gray-700" />
              </button>
            </div>

          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <Bookmark size={20} className="text-gray-700" />
          </button>
        </div>

  
        {/* Likes & Description for posts with media */}
        {post.assets && post.assets.length > 0 && (
          <>
            {likesCount > 0 && <div className="text-sm font-semibold text-gray-600 mb-1">{likesCount} likes</div>}
  
            {post.description && (
              <div className="text-sm text-gray-800 mb-2">
                <button
                  onClick={() => window.location.href = `/profile/${post.author?.username || 'unknown'}`}
                  className="font-semibold mr-2 hover:underline text-gray-500"
                >
                  {post.author?.username || 'Unknown'}
                </button>
                <MentionText text={showFull ? post.description : descShort} />
                {post.description.length > 120 && (
                  <button className="ml-2 text-sm text-gray-500" onClick={() => setShowFull(s => !s)}>
                    {showFull ? 'less' : 'more'}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Likes count for posts without media */}
        {(!post.assets || post.assets.length === 0) && likesCount > 0 && (
          <div className="text-sm font-semibold text-gray-600 mb-1">{likesCount} likes</div>
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
  
        {/* Add Comment */}
        <div className="pt-2 border-t flex items-start gap-3">
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
              className="flex-1 text-sm bg-gray-100 text-gray-600 placeholder:text-gray-400 px-3 py-2 rounded-lg border border-gray-300 resize-none min-h-[40px] mb-1 box-border"
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
              className="self-end mt-1 text-sm text-blue-500 font-semibold px-3 py-1 rounded-md hover:bg-blue-50 active:bg-blue-100 transition disabled:opacity-50"
            >
              {isPublishing ? 'Posting...' : 'Publish'}
            </button>
          </div>
        </div>
  
        <div className="text-xs text-gray-400 mt-2">{timeAgo(post.createdAt)} ago</div>
      </article>
      {showShareModal && (
        <SharePostModal 
          postId={post.id} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseEditModal}>
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-600">Edit Post</h2>
              <button
                onClick={handleCloseEditModal}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Existing Assets */}
              {editExistingAssets.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Media</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {editExistingAssets.map((asset) => {
                      const isMarkedForDelete = editAssetsToDelete.includes(asset.id);
                      const isVideo = asset.type === 'VIDEO' || !!asset.url.match(/\.(mp4|webm|ogg|mov)$/i);
                      return (
                        <div
                          key={asset.id}
                          className={`relative aspect-square border-2 rounded-lg overflow-hidden ${
                            isMarkedForDelete ? 'border-red-500 opacity-50' : 'border-gray-200'
                          }`}
                        >
                          {isVideo ? (
                            <video
                              src={asset.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                            />
                          ) : (
                            <Image
                              src={asset.url}
                              alt="asset"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 33vw, 150px"
                            />
                          )}
                          <button
                            onClick={() => handleDeleteExistingAsset(asset.id)}
                            className={`absolute top-1 right-1 p-1 rounded-full text-white text-xs ${
                              isMarkedForDelete ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {isMarkedForDelete ? 'Restore' : 'Delete'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* New Files Preview */}
              {(editPreviews.length > 0 || editExistingAssets.length - editAssetsToDelete.length + editFiles.length < 10) && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Media</h3>
                  {editPreviews.length > 0 && (
                    <div className="border rounded-lg overflow-hidden relative mb-2">
                      {editFileTypes[editCurrentIndex] === 'image' ? (
                        <Image
                          src={editPreviews[editCurrentIndex]}
                          alt={`preview-${editCurrentIndex}`}
                          width={400}
                          height={200}
                          className="w-full h-auto object-contain"
                        />
                      ) : (
                        <video
                          src={editPreviews[editCurrentIndex]}
                          className="w-full h-auto object-contain"
                          controls
                        />
                      )}

                      {editPreviews.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditCurrentIndex(i => (i - 1 + editPreviews.length) % editPreviews.length);
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1"
                          >
                            ‹
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditCurrentIndex(i => (i + 1) % editPreviews.length);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full p-1"
                          >
                            ›
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDeleteNewFile(editCurrentIndex)}
                        className="absolute top-2 right-2 text-sm text-red-600 bg-white/80 rounded px-2 py-1"
                      >
                        Удалить
                      </button>

                      {editPreviews.length > 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex gap-2">
                          {editPreviews.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setEditCurrentIndex(idx)}
                              className={`w-2 h-2 rounded-full ${
                                idx === editCurrentIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleEditFileChange}
                      className="hidden"
                      id="edit-file-upload"
                      multiple
                      disabled={editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10}
                    />
                    <label
                      htmlFor="edit-file-upload"
                      className={`inline-block px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {editPreviews.length > 0
                        ? `Add More (${editExistingAssets.length - editAssetsToDelete.length + editFiles.length}/10)`
                        : 'Add Files'}
                    </label>
                    {editExistingAssets.length - editAssetsToDelete.length + editFiles.length >= 10 && (
                      <p className="text-xs text-gray-500 mt-2">Maximum 10 files</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <MentionTextarea
                  value={editDescription}
                  onChange={setEditDescription}
                  placeholder="Edit post description... (use @ to mention)"
                  className="w-full text-sm bg-gray-50 text-gray-800 placeholder:text-gray-400 px-3 py-2 rounded-lg border border-gray-300 resize-none min-h-[100px] box-border"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end p-4 border-t">
              <button
                onClick={handleCloseEditModal}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                disabled={isEditing}
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                disabled={isEditing}
                className="px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
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
