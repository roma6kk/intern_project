'use client';

import { useState, useEffect } from 'react';
import { X, UserPlus, UserMinus, Crown, Loader2, User, LogOut } from 'lucide-react';
import { Chat, ChatMember } from '@/types/index';
import {
  updateChatMembers,
  leaveChat,
  updateChatInfo,
  promoteToAdmin,
} from '@/lib/services/chat.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import api from '@/lib/api';

interface Profile {
  id: string;
  userId: string;
  firstName: string;
  secondName?: string;
  avatarUrl?: string;
  user?: {
    id: string;
    account?: {
      username: string;
    };
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  chat: Chat;
  onChatUpdated?: (updatedChat: Chat) => void;
  onLeftChat?: () => void;
}

export default function ChatManagementModal({
  open,
  onClose,
  chat,
  onChatUpdated,
  onLeftChat,
}: Props) {
  const { user } = useAuth();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [members, setMembers] = useState<ChatMember[]>(chat.members || []);
  const [editName, setEditName] = useState(chat.name ?? '');
  const [editDescription, setEditDescription] = useState(chat.description ?? '');
  const [savingInfo, setSavingInfo] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [selectedNewAdminId, setSelectedNewAdminId] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const currentUserMember = members.find((m) => m.id === user?.id);
  const isAdmin =
    currentUserMember?.role === 'ADMIN' || chat.creatorId === user?.id;
  const isGroupChat = chat.type === 'GROUP';
  const otherAdminsCount = members.filter(
    (m) => m.id !== user?.id && m.role === 'ADMIN',
  ).length;
  const isLastAdmin = isAdmin && otherAdminsCount === 0;

  useEffect(() => {
    if (open) {
      setMembers(chat.members || []);
      setEditName(chat.name ?? '');
      setEditDescription(chat.description ?? '');
      setSearchQuery('');
      setSearchResults([]);
      setShowLeaveConfirm(false);
      setSelectedNewAdminId(null);
    }
  }, [open, chat]);

  const searchUsers = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/profiles/search?query=${query}`);
      const profiles = res.data ?? [];
      const users: ChatMember[] = profiles
        .map((profile: Profile) => ({
          id: profile.user?.id || '',
          account: {
            username: profile.user?.account?.username || '',
          },
          profile: {
            firstName: profile.firstName,
            secondName: profile.secondName,
            avatarUrl: profile.avatarUrl || null,
          },
        }))
        .filter((u: ChatMember) => u.id && !members.some((m) => m.id === u.id));

      setSearchResults(users);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!isAdmin || !isGroupChat) return;
    if (!editName.trim()) {
      toast.error('Chat name is required');
      return;
    }
    setSavingInfo(true);
    try {
      const updatedChat = await updateChatInfo(chat.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
      });
      setMembers(updatedChat.members || []);
      toast.success('Chat info updated');
      onChatUpdated?.(updatedChat);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to update';
      toast.error(msg);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleAddMember = async (memberId: string) => {
    if (!isAdmin || !isGroupChat) return;

    setUpdating(true);
    try {
      const updatedChat = await updateChatMembers(chat.id, [memberId], undefined);
      setMembers(updatedChat.members || []);
      setSearchQuery('');
      setSearchResults([]);
      toast.success('Member added successfully');
      onChatUpdated?.(updatedChat);
    } catch (error: unknown) {
      const message =
        (error && typeof error === 'object' && 'response' in error &&
          typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string')
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Failed to add member';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isAdmin || !isGroupChat) return;
    if (memberId === user?.id) return;

    setUpdating(true);
    try {
      const updatedChat = await updateChatMembers(chat.id, undefined, [memberId]);
      setMembers(updatedChat.members || []);
      toast.success('Member removed successfully');
      onChatUpdated?.(updatedChat);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to remove member';
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  const handleLeaveClick = () => {
    if (isAdmin && isLastAdmin && isGroupChat) {
      setShowLeaveConfirm(true);
      setSelectedNewAdminId(null);
    } else {
      confirmLeave(undefined);
    }
  };

  const handlePromoteToAdmin = async (memberId: string) => {
    setPromotingId(memberId);
    try {
      const updatedChat = await promoteToAdmin(chat.id, memberId);
      setMembers(updatedChat.members || []);
      toast.success('Member promoted to admin');
      onChatUpdated?.(updatedChat);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to promote';
      toast.error(message);
    } finally {
      setPromotingId(null);
    }
  };

  const confirmLeave = async (newAdminId?: string) => {
    setLeaving(true);
    try {
      await leaveChat(chat.id, newAdminId);
      toast.success('You left the chat');
      onClose();
      onLeftChat?.();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to leave chat';
      toast.error(message);
    } finally {
      setLeaving(false);
      setShowLeaveConfirm(false);
      setSelectedNewAdminId(null);
    }
  };

  const getMemberDisplayName = (member: ChatMember) => {
    return (
      member.account?.username ||
      member.profile?.firstName ||
      'Unknown'
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isGroupChat ? 'Group Chat Settings' : 'Chat Info'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Info */}
        <div className="mb-6">
          {isGroupChat && isAdmin ? (
            <div className="mb-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Chat name *</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-gray-800"
                  placeholder="Group name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Description (optional)</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-gray-800 resize-none"
                  placeholder="Short description"
                  rows={2}
                  maxLength={500}
                />
              </div>
              <button
                onClick={handleSaveInfo}
                disabled={savingInfo || !editName.trim()}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {savingInfo ? 'Saving...' : 'Save'}
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-600">Chat name</label>
                <p className="text-lg font-semibold text-gray-800">
                  {chat.name || (isGroupChat ? 'Group Chat' : 'Private Chat')}
                </p>
              </div>
              {chat.description && (
                <div className="mb-2">
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="text-gray-700 text-sm">{chat.description}</p>
                </div>
              )}
            </>
          )}
          {chat.creator && (
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-600">Created by</label>
              <div className="flex items-center gap-2 mt-1">
                <Crown size={16} className="text-yellow-500" />
                <span className="text-gray-800">
                  @{chat.creator.account?.username || 'Unknown'}
                </span>
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-600">Type</label>
            <p className="text-gray-800 capitalize">{chat.type.toLowerCase()}</p>
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Members ({members.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {members.map((member) => {
              const isCurrentUser = member.id === user?.id;
              const canRemove =
                isAdmin && isGroupChat && !isCurrentUser;
              const canPromote =
                isAdmin &&
                isGroupChat &&
                !isCurrentUser &&
                member.role === 'MEMBER';
              const isPromoting = promotingId === member.id;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {member.profile?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- avatar URL may be external
                      <img
                        src={member.profile.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium">
                          {getMemberDisplayName(member).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-700">
                          {getMemberDisplayName(member)}
                        </span>
                        {member.role === 'ADMIN' && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                            ADMIN
                          </span>
                        )}
                        {member.role === 'MEMBER' && (
                          <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                            MEMBER
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs text-gray-500">(You)</span>
                        )}
                      </div>
                      {member.account?.username && (
                        <span className="text-sm text-gray-500">
                          @{member.account.username}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {canPromote && (
                      <button
                        onClick={() => handlePromoteToAdmin(member.id)}
                        disabled={updating || isPromoting}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors disabled:opacity-50"
                        title="Make admin"
                        aria-label="Make admin"
                      >
                        {isPromoting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Crown size={18} />
                        )}
                      </button>
                    )}
                    {canRemove && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={updating}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        aria-label="Remove member"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Members Section (only for admin when group has > 2 participants) */}
        {isAdmin && isGroupChat && members.length > 2 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Add Members
            </h3>

            {/* Search Input */}
            <div className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => searchUsers(e.target.value)}
                placeholder="Search users by username..."
                className="w-full text-gray-500 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updating}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border rounded-lg max-h-48 overflow-y-auto mb-3">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleAddMember(result.id)}
                  >
                    <div className="flex items-center gap-3">
                      {result.profile?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- avatar URL may be external
                        <img
                          src={result.profile.avatarUrl}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            {getMemberDisplayName(result).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-800">
                          {getMemberDisplayName(result)}
                        </span>
                        {result.account?.username && (
                          <span className="text-sm text-gray-500 block">
                            @{result.account.username}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMember(result.id);
                      }}
                      disabled={updating}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                      aria-label="Add member"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Поиск...</span>
              </div>
            )}

            {searchQuery && !loading && searchResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">Пользователи не найдены</p>
              </div>
            )}
          </div>
        )}

        {/* Info for non-admins */}
        {!isAdmin && isGroupChat && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 text-center">
              Only admins can manage members and edit chat info
            </p>
          </div>
        )}

        {/* Leave Chat */}
        <div className="border-t pt-4 mt-4">
          <button
            onClick={handleLeaveClick}
            disabled={leaving}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <LogOut size={18} />
            Leave chat
          </button>
        </div>

        {/* Leave confirm modal (when last admin: select new admin) */}
        {showLeaveConfirm && isLastAdmin && isGroupChat && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div
              className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Transfer admin role
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You are the last admin. Select a participant to become the new admin before leaving.
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {members
                  .filter((m) => m.id !== user?.id)
                  .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedNewAdminId(m.id)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                        selectedNewAdminId === m.id
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="font-medium text-gray-800">
                        {getMemberDisplayName(m)}
                      </span>
                      {selectedNewAdminId === m.id && (
                        <span className="text-blue-600 text-sm">✓</span>
                      )}
                    </button>
                  ))}
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setShowLeaveConfirm(false);
                    setSelectedNewAdminId(null);
                  }}
                  className="px-3 py-2 rounded-lg border text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => selectedNewAdminId && confirmLeave(selectedNewAdminId)}
                  disabled={!selectedNewAdminId || leaving}
                  className="px-3 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                >
                  {leaving ? 'Leaving...' : 'Leave and transfer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
