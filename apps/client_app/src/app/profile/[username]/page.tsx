'use client';

import { useState, useEffect } from 'react';
import { Loader2, UserX } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import PostsGrid from '@/components/profile/PostsGrid';
import FollowersModal from '@/components/profile/FollowersModal';
import FollowingModal from '@/components/profile/FollowingModal';
import EmptyState from '@/components/profile/EmptyState';

interface Asset {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface Author {
  id: string;
  account: { username: string };
  profile: { firstName: string; avatarUrl: string };
}

interface Post {
  id: string;
  description: string;
  isArchived: boolean;
  assets: Asset[];
  author: Author;
  authorId?: string;
  _count: { likes: number; comments: number };
  createdAt: string;
}

interface Account { username: string; }

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
  account: { username: string };
  profile: { firstName: string; secondName: string; avatarUrl: string | null };
}

interface FollowerItem { id: string; follower: FollowUser; }

interface FollowingItem {
  id: string;
  following: FollowUser;
  status?: 'ACCEPTED' | 'PENDING' | 'DECLINED';
}

export default function ProfilePage() {

  const { user: currentUser } = useAuth();
  const toast = useToast();
  const params = useParams();
  const router = useRouter();

  const username = params.username as string;
  const isMyProfile = username === 'me';

  const [activeTab, setActiveTab] = useState<'posts'|'liked'|'commented'|'archived'>('posts');
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [archivedPosts, setArchivedPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [commentedPosts, setCommentedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [isPendingFollowRequest, setIsPendingFollowRequest] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);

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

        const profileEndpoint =
          isMyProfile ? '/profiles/me' : `/profiles/by-username/${username}`;

        const profileResponse = await api.get(profileEndpoint);
        const profileData: ProfileData = profileResponse.data;
        setUserProfile(profileData);

        try {
          const endpoint =
            isMyProfile
              ? '/follows/followers/me'
              : `/follows/followers/${profileData.userId}`;

          const r = await api.get(endpoint);
          const data = Array.isArray(r.data) ? r.data : [];
          setFollowersCount(data.length || 0);
        } catch { setFollowersCount(0); }

        try {
          const endpoint =
            isMyProfile
              ? '/follows/following/me'
              : `/follows/following/${profileData.userId}`;

          const r = await api.get(endpoint);
          const data = Array.isArray(r.data) ? r.data : [];
          setFollowingCount(
            isMyProfile
              ? data.filter((f: { status?: string }) => f.status === 'ACCEPTED').length
              : data.length
          );
        } catch { setFollowingCount(0); }

        let isFollowing = false;
        let isPending = false;

        if (!isMyProfile) {

          try {
            const r = await api.get('/follows/following/me');

            const rel = r.data.find(
              (f: FollowingItem) =>
                f.following.id === profileData.userId
            );

            if (rel) {
              if (rel.status === 'PENDING') isPending = true;
              else isFollowing = true;
            }

          } catch {}
        }

        setIsFollowingUser(isFollowing);
        setIsPendingFollowRequest(isPending);

        try {

          const postsResponse = await api.get('/posts',{
            params:{page:1,limit:50, authorId: profileData.userId}
          });

          const allPosts = postsResponse.data.data || [];
          const userPosts = allPosts.filter(
            (p:Post)=>p.author?.id===profileData.userId && !p.isArchived
          );

          if (!profileData.isPrivate || isMyProfile || isFollowing) {
            setPosts(userPosts);
          } else setPosts([]);

          if (isMyProfile) {
            try {
              const archivedResponse = await api.get('/posts', {
                params: {
                  page: 1,
                  limit: 50,
                  authorId: profileData.userId,
                  includeArchived: true
                }
              });
              const allArchivedPosts = archivedResponse.data.data || [];
              const userArchivedPosts = allArchivedPosts.filter(
                (p: Post) => p.author?.id === profileData.userId && p.isArchived
              );
              setArchivedPosts(userArchivedPosts);
            } catch {
              setArchivedPosts([]);
            }

            try {
              const likedResponse = await api.get('/posts', {
                params: { page: 1, limit: 50, likedByUserId: profileData.userId }
              });
              setLikedPosts(likedResponse.data.data || []);
            } catch {
              setLikedPosts([]);
            }

            try {
              const commentedResponse = await api.get('/posts', {
                params: { page: 1, limit: 50, commentedByUserId: profileData.userId }
              });
              setCommentedPosts(commentedResponse.data.data || []);
            } catch {
              setCommentedPosts([]);
            }
          } else {
            setLikedPosts([]);
            setCommentedPosts([]);
          }

        } catch { setPosts([]); }

      }
      catch {
        setError('Failed to load profile data');
      }
      finally {
        setLoading(false);
      }
    };

    fetchProfileData();

  },[username,isMyProfile]);

  const handleFollowToggle = async () => {

    if (!userProfile || isFollowLoading) return;

    try {

      setIsFollowLoading(true);

      if (isFollowingUser || isPendingFollowRequest) {

        await api.delete(`/follows/${userProfile.userId}`);
        setIsFollowingUser(false);
        setIsPendingFollowRequest(false);

      } else {

        const r = await api.post(`/follows/${userProfile.userId}`);

        if (r.data?.status === 'PENDING') {
          setIsPendingFollowRequest(true);
          setIsFollowingUser(false);
        } else {
          setIsFollowingUser(true);
          setIsPendingFollowRequest(false);
        }
      }

    } catch {
      setError('Failed to update follow status');
    }
    finally {
      setIsFollowLoading(false);
    }
  };

  const handleSendMessage = async () => {

    if (!currentUser || !userProfile || isMessageLoading) return;

    setIsMessageLoading(true);

    try {
      const response = await api.post('/chats', {
        memberIds: [userProfile.userId],
      });
      const chatId = response.data?.id;
      if (chatId) {
        router.push(`/chat?chatId=${chatId}`);
      } else {
        router.push('/chat');
      }
    }
    catch {
      alert('Failed to start chat');
    }
    finally {
      setIsMessageLoading(false);
    }
  };

  const openFollowersModal = async () => {

    try {
      setListLoading(true);

      const endpoint =
        isMyProfile
          ? '/follows/followers/me'
          : `/follows/followers/${userProfile?.userId}`;

      const r = await api.get(endpoint);
      setFollowersList(r.data || []);
      setShowFollowersModal(true);

    } finally {
      setListLoading(false);
    }
  };

  const openFollowingModal = async () => {

    try {
      setListLoading(true);

      const endpoint =
        isMyProfile
          ? '/follows/following/me'
          : `/follows/following/${userProfile?.userId}`;

      const r = await api.get(endpoint);
      const list = r.data || [];
      setFollowingList(
        isMyProfile
          ? list.filter((f: FollowingItem) => f.status === 'ACCEPTED')
          : list
      );
      setShowFollowingModal(true);

    } finally {
      setListLoading(false);
    }
  };

  const handleRemoveFollower = async (followerId: string) => {
    const prevList = followersList;
    const prevCount = followersCount;
    setFollowersList((prev) => prev.filter((f) => f.follower.id !== followerId));
    setFollowersCount((prev) => prev - 1);
    try {
      await api.delete(`/follows/remove-follower/${followerId}`);
    } catch {
      setFollowersList(prevList);
      setFollowersCount(prevCount);
      toast.error('Failed to remove follower');
    }
  };

  const handleUnfollow = async (followingId: string, userId: string) => {
    await api.delete(`/follows/${userId}`);
    setFollowingList((prev) => prev.filter((f) => f.id !== followingId));
    setFollowingCount((prev) => prev - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
          <p className="text-gray-600 font-medium">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center gap-4 max-w-sm w-full">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <UserX className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-gray-600 font-medium text-center">{error || 'Профиль не найден'}</p>
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Назад
          </button>
        </div>
      </div>
    );
  }

  const isPrivateAndNotFollowing =
    userProfile.isPrivate &&
    !isMyProfile &&
    !isFollowingUser &&
    !isPendingFollowRequest;

  return (
    <div className="min-h-screen bg-white">

      <ProfileHeader
        userProfile={userProfile}
        avatarError={avatarError}
        setAvatarError={setAvatarError}
        isMyProfile={isMyProfile}
        isFollowingUser={isFollowingUser}
        isPendingFollowRequest={isPendingFollowRequest}
        isFollowLoading={isFollowLoading}
        isMessageLoading={isMessageLoading}
        followersCount={followersCount}
        followingCount={followingCount}
        postsCount={posts.length}
        openFollowersModal={openFollowersModal}
        openFollowingModal={openFollowingModal}
        handleFollowToggle={handleFollowToggle}
        handleSendMessage={handleSendMessage}
        router={router}
      />

      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showLikedCommented={isMyProfile}
        showArchived={isMyProfile}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">

        {activeTab==='posts' && (
          isPrivateAndNotFollowing
            ? <EmptyState type="private"/>
            : posts.length===0
              ? <EmptyState type="posts"/>
              : <PostsGrid posts={posts} router={router}/>
        )}

        {activeTab==='liked' && (
          isMyProfile
            ? likedPosts.length===0
              ? <EmptyState type="liked"/>
              : <PostsGrid posts={likedPosts} router={router}/>
            : <EmptyState type="private"/>
        )}

        {activeTab==='commented' && (
          isMyProfile
            ? commentedPosts.length===0
              ? <EmptyState type="commented"/>
              : <PostsGrid posts={commentedPosts} router={router}/>
            : <EmptyState type="private"/>
        )}

        {activeTab==='archived' && (
          isMyProfile
            ? archivedPosts.length===0
              ? <EmptyState type="archived"/>
              : <PostsGrid posts={archivedPosts} router={router}/>
            : <EmptyState type="private"/>
        )}

      </div>

      <FollowersModal
        show={showFollowersModal}
        onClose={()=>setShowFollowersModal(false)}
        followersList={followersList}
        isMyProfile={isMyProfile}
        listLoading={listLoading}
        handleRemoveFollower={handleRemoveFollower}
      />

      <FollowingModal
        show={showFollowingModal}
        onClose={()=>setShowFollowingModal(false)}
        followingList={followingList}
        isMyProfile={isMyProfile}
        listLoading={listLoading}
        handleUnfollow={handleUnfollow}
      />

    </div>
  );
}
