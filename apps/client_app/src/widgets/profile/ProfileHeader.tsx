'use client';

import Image from 'next/image';
import { Settings, Loader2 } from 'lucide-react';

interface ProfileData {
  id: string;
  userId: string;
  firstName: string;
  secondName: string;
  avatarUrl: string | null;
  bio: string | null;
  isPrivate: boolean;
  user: {
    account: {
      username: string;
    };
  };
}

interface ProfileHeaderProps {
  userProfile: ProfileData;
  avatarError: boolean;
  setAvatarError: (value: boolean) => void;
  isMyProfile: boolean;
  isFollowingUser: boolean;
  isPendingFollowRequest: boolean;
  isFollowLoading: boolean;
  isMessageLoading: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  openFollowersModal: () => void;
  openFollowingModal: () => void;
  handleFollowToggle: () => void;
  handleSendMessage: () => void;
  router: {
    push: (path: string) => void;
  };
  isPrivateAndNotFollowing?: boolean;
}

export default function ProfileHeader({
  userProfile,
  avatarError,
  setAvatarError,
  isMyProfile,
  isFollowingUser,
  isPendingFollowRequest,
  isFollowLoading,
  isMessageLoading,
  followersCount,
  followingCount,
  postsCount,
  openFollowersModal,
  openFollowingModal,
  handleFollowToggle,
  handleSendMessage,
  router,
  isPrivateAndNotFollowing = false,
}: ProfileHeaderProps) {
  const avatarUrl = userProfile.avatarUrl || '/default-avatar.svg';
  const fullName = `${userProfile.firstName} ${userProfile.secondName}`;
  const bio = userProfile.bio || '';

  return (
    <div className="border-b border-border/70">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-8 md:gap-12">
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 relative">
              <Image
                src={avatarError ? '/default-avatar.svg' : avatarUrl}
                alt={userProfile.user.account.username}
                fill
                className="rounded-full object-cover ring-2 ring-primary/25"
                priority
                onError={() => setAvatarError(true)}
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{userProfile.user.account.username}</h1>
              </div>

              <div className="flex gap-2 mb-4">
                {isMyProfile ? (
                  <>
                    <button
                      onClick={() => router.push('/profile/settings')}
                      className="px-4 py-2 border border-border rounded-full hover:bg-muted/50 transition-colors flex items-center gap-2 bg-background/70"
                    >
                      <Settings className="w-5 h-5 text-muted-foreground" />
                      <span className="font-semibold text-muted-foreground">Settings</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      className={`px-8 py-2 rounded-full font-semibold transition-colors flex items-center gap-2 ${
                        isFollowingUser
                          ? 'bg-muted text-foreground hover:bg-muted/80 disabled:bg-muted'
                          : isPendingFollowRequest
                          ? 'bg-muted text-foreground hover:bg-muted/80 disabled:bg-muted'
                          : 'bg-primary text-white hover:opacity-90 disabled:opacity-70'
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
                        <span>Cancel Request</span>
                      ) : isFollowingUser ? (
                        <span>Following</span>
                      ) : (
                        <span>Follow</span>
                      )}
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={isMessageLoading}
                      className="px-4 py-2 bg-muted text-foreground rounded-full font-semibold hover:bg-muted/80 transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                      {isMessageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Message'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-8 mb-4">
              <div>
                <span className="font-semibold text-muted-foreground">{postsCount || 0}</span>
                <p className="text-muted-foreground text-sm">posts</p>
              </div>
              <button
                onClick={openFollowersModal}
                className="text-left hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span className="font-semibold text-muted-foreground">{(followersCount || 0).toLocaleString()}</span>
                <p className="text-muted-foreground text-sm">followers</p>
              </button>
              <button
                onClick={openFollowingModal}
                className="text-left hover:opacity-70 transition-opacity cursor-pointer"
              >
                <span className="font-semibold text-muted-foreground">{followingCount || 0}</span>
                <p className="text-muted-foreground text-sm">following</p>
              </button>
            </div>

            <div>
              <p className="font-semibold mb-1 text-muted-foreground">{fullName}</p>
              {!isPrivateAndNotFollowing && <p className="text-sm text-muted-foreground mb-2">{bio}</p>}
              {isPrivateAndNotFollowing && (
                <p className="text-sm text-muted-foreground mb-2">This account is private</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
