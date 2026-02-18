'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Grid, Play, Tag, Loader2, X, Settings } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Asset {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface Author {
  id: string;
  account: {
    username: string;
  };
  profile: {
    firstName: string;
    avatarUrl: string;
  };
}

interface Post {
  id: string;
  description: string;
  assets: Asset[];
  author: Author;
  authorId?: string;
  _count: {
    likes: number;
    comments: number;
  };
  createdAt: string;
}

interface Account {
  username: string;
}

interface User {
  id: string;
  createdAt: string;
  account: Account;
}

interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  secondName: string;
  avatarUrl: string | null;
  bio: string | null;
  birthday: string | null;
  isPrivate: boolean;
  user: User;
}

interface FollowUser {
  id: string;
  account: {
    username: string;
  };
  profile: {
    firstName: string;
    secondName: string;
    avatarUrl: string | null;
  };
}

interface FollowerItem {
  id: string;
  follower: FollowUser;
}

interface FollowingItem {
  id: string;
  following: FollowUser;
  status?: 'ACCEPTED' | 'PENDING' | 'DECLINED';
}

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const isMyProfile = username === 'me';

  const isVideoAsset = (asset?: Asset) => {
    if (!asset?.url) return false;
    if (asset.type === 'VIDEO') return true;
    return /\.(mp4|webm|ogg|mov)$/i.test(asset.url);
  };

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isPendingFollowRequest, setIsPendingFollowRequest] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followersList, setFollowersList] = useState<FollowerItem[]>([]);
  const [followingList, setFollowingList] = useState<FollowingItem[]>([]);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        setFollowersCount(0);
        setFollowingCount(0);
        setIsFollowingUser(false);
        setIsPendingFollowRequest(false);

        const profileEndpoint = isMyProfile ? '/profiles/me' : `/profiles/by-username/${username}`;
        const profileResponse = await api.get(profileEndpoint);
        const profileData: ProfileData = profileResponse.data;
        setUserProfile(profileData);

        try {
          const followersEndpoint = isMyProfile ? '/follows/followers/me' : `/follows/followers/${profileData.userId}`;
          const followersResponse = await api.get(followersEndpoint);
          const followersData = Array.isArray(followersResponse.data) ? followersResponse.data : [];
          setFollowersCount(followersData.length || 0);
        } catch (err) {
          console.error('Failed to load followers count:', err);
          setFollowersCount(0);
        }

        try {
          const followingEndpoint = isMyProfile ? '/follows/following/me' : `/follows/following/${profileData.userId}`;
          const followingResponse = await api.get(followingEndpoint);
          const followingData = Array.isArray(followingResponse.data) ? followingResponse.data : [];
          setFollowingCount(followingData.length || 0);
        } catch (err) {
          console.error('Failed to load following count:', err);
          setFollowingCount(0);
        }

        try {
          await api.get('/follows/requests/me');
        } catch {
        }

        let isFollowing = false;
        let isPending = false;

        if (!isMyProfile) {
          try {
            const followingResponse = await api.get('/follows/following/me');
            console.log('Following response:', followingResponse.data);
            console.log('Looking for userId:', profileData.userId);
            
            const followRelation = followingResponse.data.find(
              (follow: FollowingItem) => follow.following.id === profileData.userId
            );
            
            console.log('Found follow relation:', followRelation);
            console.log('Follow relation status:', followRelation?.status);
            
            if (followRelation) {
              if (followRelation.status === 'PENDING') {
                isPending = true;
                isFollowing = false;
              } else if (followRelation.status === 'ACCEPTED') {
                isFollowing = true;
                isPending = false;
              } else {
                // Если статуса нет или он не PENDING/ACCEPTED, считаем что подписка активна
                isFollowing = true;
                isPending = false;
              }
            }
            
            console.log('Final status - isFollowing:', isFollowing, 'isPending:', isPending);
            
            setIsPendingFollowRequest(isPending);
            setIsFollowingUser(isFollowing);
          } catch {
            setIsFollowingUser(false);
            setIsPendingFollowRequest(false);
          }
        }

        try {
          const postsResponse = await api.get('/posts', {
            params: {
              page: 1,
              limit: 50,
            },
          });
          
          const userPosts = (postsResponse.data.data || []).filter(
            (post: Post) => {
              const postAuthorId = post.author?.id;
              return postAuthorId === profileData.userId;
            }
          );
          
          if (!profileData.isPrivate || isMyProfile || isFollowing) {
            setPosts(userPosts);
          } else {
            setPosts([]);
          }
        } catch {
          setPosts([]);
        }
      } catch {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, isMyProfile]);

  const handleFollowToggle = async () => {
    if (!userProfile || isFollowLoading) return;

    try {
      setIsFollowLoading(true);

      if (isFollowingUser || isPendingFollowRequest) {
        await api.delete(`/follows/${userProfile.userId}`);
        setIsFollowingUser(false);
        setIsPendingFollowRequest(false);
      } else {
        const response = await api.post(`/follows/${userProfile.userId}`);
        
        if (response.data?.status === 'PENDING') {
          setIsPendingFollowRequest(true);
          setIsFollowingUser(false);
        } else if (response.data?.status === 'ACCEPTED') {
          setIsFollowingUser(true);
          setIsPendingFollowRequest(false);
        }
      }
    } catch (error) {
      setError('Failed to update follow status');
      console.error('Follow toggle error:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const openFollowersModal = async () => {
    try {
      setListLoading(true);
      const endpoint = isMyProfile ? '/follows/followers/me' : `/follows/followers/${userProfile?.userId}`;
      const response = await api.get(endpoint);
      setFollowersList(response.data || []);
      setShowFollowersModal(true);
    } catch (error) {
      console.error('Failed to load followers:', error);
    } finally {
      setListLoading(false);
    }
  };

  const openFollowingModal = async () => {
    try {
      setListLoading(true);
      const endpoint = isMyProfile ? '/follows/following/me' : `/follows/following/${userProfile?.userId}`;
      const response = await api.get(endpoint);
      setFollowingList(response.data || []);
      setShowFollowingModal(true);
    } catch (error) {
      console.error('Failed to load following:', error);
    } finally {
      setListLoading(false);
    }
  };

  const handleRemoveFollower = async (followerId: string) => {
    try {
      await api.delete(`/follows/remove-follower/${followerId}`);
      setFollowersList(followersList.filter(f => f.id !== followerId));
      setFollowersCount(followersCount - 1);
    } catch (error) {
      console.error('Failed to remove follower:', error);
    }
  };

  const handleUnfollow = async (followingId: string, userId: string) => {
    try {
      await api.delete(`/follows/${userId}`);
      setFollowingList(followingList.filter(f => f.id !== followingId));
      setFollowingCount(followingCount - 1);
    } catch (error) {
      console.error('Failed to unfollow:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">{error || 'Profile not found'}</p>
        </div>
      </div>
    );
  }

  const fullName = `${userProfile.firstName} ${userProfile.secondName}`;
  const avatarUrl = userProfile.avatarUrl || '/default-avatar.svg';
  const bio = userProfile.bio || '';
  const postsCount = posts.length;
  const isPrivateAndNotFollowing = userProfile.isPrivate && !isMyProfile && !isFollowingUser && !isPendingFollowRequest;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex gap-8 md:gap-12">
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 relative">
                <Image
                  src={avatarError ? '/default-avatar.svg' : avatarUrl}
                  alt={userProfile.user.account.username}
                  fill
                  className="rounded-full object-cover"
                  priority
                  onError={() => setAvatarError(true)}
                />
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl md:text-3xl font-light text-gray-500">{userProfile.user.account.username}</h1>
                </div>

                <div className="flex gap-2 mb-4">
                  {isMyProfile ? (
                    <>
                      <button 
                        onClick={() => router.push('/profile/settings')}
                        className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Settings className="w-5 h-5 text-gray-500" />
                        <span className="font-semibold text-gray-500">Settings</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        disabled={isFollowLoading}
                        className={`px-8 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
                          isFollowingUser
                            ? 'bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-200'
                            : isPendingFollowRequest
                            ? 'bg-gray-200 text-black hover:bg-gray-300 disabled:bg-gray-200'
                            : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400'
                        } disabled:cursor-not-allowed`}
                      >
                        {isFollowLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                              {isFollowingUser ? 'Unfollowing' : isPendingFollowRequest ? 'Canceling' : 'Following'}
                            </span>
                          </>
                        ) : isPendingFollowRequest ? (
                          <span>Request Sent</span>
                        ) : isFollowingUser ? (
                          <span>Following</span>
                        ) : (
                          <span>Follow</span>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-8 mb-4">
                <div>
                  <span className="font-semibold text-gray-500">{postsCount || 0}</span>
                  <p className="text-gray-600 text-sm">posts</p>
                </div>
                <button 
                  onClick={openFollowersModal}
                  className="text-left hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <span className="font-semibold text-gray-500">{(followersCount || 0).toLocaleString()}</span>
                  <p className="text-gray-600 text-sm">followers</p>
                </button>
                <button 
                  onClick={openFollowingModal}
                  className="text-left hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <span className="font-semibold text-gray-500">{followingCount || 0}</span>
                  <p className="text-gray-600 text-sm">following</p>
                </button>
              </div>

              <div>
                <p className="font-semibold mb-1 text-gray-500">{fullName}</p>
                {!isPrivateAndNotFollowing && <p className="text-sm text-gray-500 mb-2">{bio}</p>}
                {isPrivateAndNotFollowing && (
                  <p className="text-sm text-gray-500 mb-2">This account is private</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8 justify-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-2 font-semibold text-sm uppercase tracking-wider transition-colors relative ${
                activeTab === 'posts' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4" />
                Posts
              </div>
              {activeTab === 'posts' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`py-4 px-2 font-semibold text-sm uppercase tracking-wider transition-colors relative ${
                activeTab === 'reels' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Reels
              </div>
              {activeTab === 'reels' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`py-4 px-2 font-semibold text-sm uppercase tracking-wider transition-colors relative ${
                activeTab === 'tagged' ? 'text-black' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tagged
              </div>
              {activeTab === 'tagged' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'posts' && (
          <>
            {isPrivateAndNotFollowing ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-semibold mb-2">This Account is Private</p>
                <p className="text-gray-400 text-sm text-center">Follow this account to see their posts</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Grid className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No posts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1 md:gap-4">
                {posts.map((post) => {
                  const firstAsset = post.assets?.[0];
                  const isVideo = isVideoAsset(firstAsset);
                  const hasMultipleAssets = post.assets && post.assets.length > 1;
                  
                  return (
                    <div
                      key={post.id}
                      className="group relative overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                      onClick={() => router.push(`/post/${post.id}`)}
                    >
                      {firstAsset ? (
                        isVideo ? (
                          <video
                            key={firstAsset.url}
                            src={firstAsset.url}
                            preload="metadata"
                            muted
                            playsInline
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                            onLoadedData={(e) => {
                              const v = e.currentTarget;
                              v.pause();
                              try {
                                v.currentTime = 0;
                              } catch {
                              }
                            }}
                            onError={(e) => {
                              const v = e.currentTarget;
                              v.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Image
                            src={firstAsset.url}
                            alt={post.description || 'Post image'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                            unoptimized
                            onError={() => {
                            }}
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Grid className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      {isVideo && (
                        <div className="absolute top-2 left-2 bg-black bg-opacity-60 rounded-full p-1.5">
                          <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
                        </div>
                      )}
                      
                      {hasMultipleAssets && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1.5">
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                            <path d="M1 6a1 1 0 011-1h1v2H2v8h8v1a1 1 0 01-1 1H2a1 1 0 01-1-1V6z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-2 md:gap-4 opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-1 text-white font-semibold text-sm md:text-base">
                          <Heart className="w-4 h-4 md:w-5 md:h-5 fill-white" />
                          <span>
                            {post._count?.likes > 1000
                              ? `${(post._count.likes / 1000).toFixed(1)}K`
                              : post._count?.likes || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-white font-semibold text-sm md:text-base">
                          <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                          <span>
                            {post._count?.comments > 1000
                              ? `${(post._count.comments / 1000).toFixed(1)}K`
                              : post._count?.comments || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'reels' && (
          <div className="flex flex-col items-center justify-center py-16">
            {isPrivateAndNotFollowing ? (
              <>
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">This Account is Private</p>
              </>
            ) : (
              <>
                <Play className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No reels yet</p>
              </>
            )}
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="flex flex-col items-center justify-center py-16">
            {isPrivateAndNotFollowing ? (
              <>
                <div className="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">This Account is Private</p>
              </>
            ) : (
              <>
                <Tag className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No tagged posts yet</p>
              </>
            )}
          </div>
        )}
      </div>

      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-500">Followers</h2>
              <button
                onClick={() => setShowFollowersModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {listLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : followersList.length === 0 ? (
                <div className="flex items-center justify-center h-20">
                  <p className="text-gray-500 text-sm">No followers yet</p>
                </div>
              ) : (
                followersList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-8 h-8 shrink-0">
                        <Image
                          src={item.follower.profile.avatarUrl || '/default-avatar.svg'}
                          alt={item.follower.account.username}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-500">{item.follower.account.username}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.follower.profile.firstName} {item.follower.profile.secondName}
                        </p>
                      </div>
                    </div>
                    {isMyProfile && (
                      <button
                        onClick={() => handleRemoveFollower(item.follower.id)}
                        className="px-4 py-1 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-500">Following</h2>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              {listLoading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : followingList.length === 0 ? (
                <div className="flex items-center justify-center h-20">
                  <p className="text-gray-500 text-sm">Not following anyone yet</p>
                </div>
              ) : (
                followingList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative w-8 h-8 shrink-0">
                        <Image
                          src={item.following.profile.avatarUrl || '/default-avatar.svg'}
                          alt={item.following.account.username}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-gray-500">{item.following.account.username}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.following.profile.firstName} {item.following.profile.secondName}
                        </p>
                      </div>
                    </div>
                    {isMyProfile && (
                      <button
                        onClick={() => handleUnfollow(item.id, item.following.id)}
                        className="px-4 py-1 text-sm font-semibold text-blue-500 hover:bg-blue-50 rounded-full transition-colors shrink-0"
                      >
                        Unfollow
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
