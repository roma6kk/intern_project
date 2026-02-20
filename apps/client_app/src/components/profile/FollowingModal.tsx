'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Loader2, UserPlus } from 'lucide-react';

interface FollowUser {
  id: string;
  account: { username: string };
  profile: {
    firstName: string;
    secondName: string;
    avatarUrl: string | null;
  };
}

interface FollowingItem {
  id: string;
  following: FollowUser;
  status?: 'ACCEPTED' | 'PENDING' | 'DECLINED';
}

interface Props {
  show: boolean;
  onClose: () => void;
  followingList: FollowingItem[];
  isMyProfile: boolean;
  listLoading: boolean;
  handleUnfollow: (followingId: string, userId: string) => void;
}

export default function FollowingModal({
  show,
  onClose,
  followingList,
  isMyProfile,
  listLoading,
  handleUnfollow,
}: Props) {

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-lg max-w-md w-full max-h-96 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-500">Following</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto flex-1">

          {listLoading ? (

            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500 mt-2">Загрузка...</span>
            </div>

          ) : followingList.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <UserPlus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">Вы ни на кого не подписаны</p>
            </div>

          ) : (

            followingList.map(item => (

              <div
                key={item.id}
                className="flex items-center justify-between p-3 border-b hover:bg-gray-50"
              >

                <Link
                  href={`/profile/${item.following.account.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                >
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={item.following.profile.avatarUrl || '/default-avatar.svg'}
                      alt={item.following.account.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate text-gray-500">
                      {item.following.account.username}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {item.following.profile.firstName} {item.following.profile.secondName}
                    </p>
                  </div>
                </Link>

                {isMyProfile && (
                  <button
                    onClick={() => handleUnfollow(item.id, item.following.id)}
                    className="px-4 py-1 text-sm font-semibold text-blue-500 hover:bg-blue-50 rounded-full transition"
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
  );
}
