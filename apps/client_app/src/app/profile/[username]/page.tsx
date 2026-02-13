'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Grid, Play, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  const isMyProfile = username === 'me';

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        const profileEndpoint = isMyProfile ? '/profiles/me' : `/profiles/by-username/${username}`;
        const profileResponse = await api.get(profileEndpoint);
        const profileData: ProfileData = profileResponse.data;
        setUserProfile(profileData);

        try {
          const followersResponse = await api.get('/follows/followers/me');
          setFollowersCount(followersResponse.data.length || 0);
        } catch {
          setFollowersCount(0);
        }

        try {
          const followingResponse = await api.get('/follows/following/me');
          setFollowingCount(followingResponse.data.length || 0);
        } catch {
          setFollowingCount(0);
        }

        try {
          await api.get('/follows/requests/me');
        } catch {
        }

        if (!isMyProfile) {
          try {
            const followingResponse = await api.get('/follows/following/me');
            const isFollowing = followingResponse.data.some(
              (follow: { following: { id: string } }) => follow.following.id === profileData.userId
            );
            setIsFollowingUser(isFollowing);
          } catch {
            setIsFollowingUser(false);
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
          
          if (!profileData.isPrivate || isMyProfile || isFollowingUser) {
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
  }, [username, isMyProfile, isFollowingUser]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
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
  const isPrivateAndNotFollowing = userProfile.isPrivate && !isMyProfile && !isFollowingUser;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex gap-8 md:gap-12">
            {/* Avatar */}
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

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl md:text-3xl font-light">{userProfile.user.account.username}</h1>
                </div>

                <div className="flex gap-2 mb-4">
                  {isMyProfile ? (
                    <>
                      <button className="px-8 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                        Edit profile
                      </button>
                      <button className="px-8 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                        Share profile
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollowToggle}
                        className={`px-8 py-2 rounded-full font-semibold transition-colors ${
                          isFollowing
                            ? 'bg-gray-200 text-black hover:bg-gray-300'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="px-8 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors">
                        Message
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-8 mb-4">
                <div>
                  <span className="font-semibold">{isPrivateAndNotFollowing ? 0 : postsCount || 0}</span>
                  <p className="text-gray-600 text-sm">posts</p>
                </div>
                <div>
                  <span className="font-semibold">{isPrivateAndNotFollowing ? 0 : (followersCount || 0).toLocaleString()}</span>
                  <p className="text-gray-600 text-sm">followers</p>
                </div>
                <div>
                  <span className="font-semibold">{isPrivateAndNotFollowing ? 0 : followingCount || 0}</span>
                  <p className="text-gray-600 text-sm">following</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="font-semibold mb-1">{fullName}</p>
                {!isPrivateAndNotFollowing && <p className="text-sm text-gray-800 mb-2">{bio}</p>}
                {isPrivateAndNotFollowing && (
                  <p className="text-sm text-gray-500 mb-2">This account is private</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Posts Grid */}
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
                  const isVideo = firstAsset?.type === 'VIDEO';
                  const hasMultipleAssets = post.assets && post.assets.length > 1;
                  
                  return (
                    <div
                      key={post.id}
                      className="group relative overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                    >
                      {firstAsset ? (
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
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <Grid className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Video indicator */}
                      {isVideo && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1.5">
                          <Play className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
                        </div>
                      )}
                      
                      {/* Multiple assets indicator */}
                      {hasMultipleAssets && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1.5">
                          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v8h10V6H5z" clipRule="evenodd" />
                            <path d="M1 6a1 1 0 011-1h1v2H2v8h8v1a1 1 0 01-1 1H2a1 1 0 01-1-1V6z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
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
    </div>
  );
};

export default ProfilePage;
