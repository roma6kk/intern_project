'use client'

import { useEffect, useState } from 'react'
import api from '@/shared/api'
import { createChat } from '@/entities/chat'
import type { Chat } from '@/entities/chat'
import { useAuth } from '@/entities/session/model/auth-context'
import { notify } from '@/shared/lib/notify'

interface User {
  id: string
  display: string
}

interface Profile {
  id: string;
  userId: string;
  firstName: string;
  secondName?: string;
  avatarUrl?: string;
  bio?: string;
  birthday?: Date;
  isPrivate: boolean;
  
  user?: {
    id: string;
    account?: {
      username: string;
    };
  };
}

interface Props {
  open: boolean
  onClose: () => void
  onCreated: (chat: Chat) => void
}

export default function CreateChatModal({ open, onClose, onCreated }: Props) {
  const { user: currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [selected, setSelected] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupAvatarFile, setGroupAvatarFile] = useState<File | null>(null)
  const [groupAvatarPreview, setGroupAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {
      if (groupAvatarPreview) URL.revokeObjectURL(groupAvatarPreview)
    }
  }, [groupAvatarPreview])

  if (!open) return null

  const search = async (q: string) => {
    setQuery(q)

    if (!q) {
      setResults([])
      return
    }

    try {
      const res = await api.get(`/profiles/search?query=${q}`)
      const users = (res.data ?? []).map((profile: Profile) => ({
        id: profile.user?.id,
        display: profile.user?.account?.username
      }))

      setResults(
        (users as User[]).filter(
          (u) => !!u?.id && (!currentUser?.id || u.id !== currentUser.id),
        ),
      )
    } catch {
      setResults([])
    }
  }

  const toggleUser = (user: User) => {
    if (currentUser?.id && user.id === currentUser.id) return
    if (selected.some(u => u.id === user.id)) {
      setSelected(selected.filter(u => u.id !== user.id))
    } else {
      setSelected([...selected, user])
    }
  }

  const handleCreate = async () => {
    if (!selected.length) return
    const isGroup = selected.length > 1
    if (isGroup && !groupName.trim()) return

    setLoading(true)

    try {
      const res = await createChat({
        memberIds: selected.map((u) => u.id),
        type: isGroup ? 'GROUP' : 'PRIVATE',
        ...(isGroup && {
          name: groupName.trim(),
          ...(groupDescription.trim() ? { description: groupDescription.trim() } : {}),
          ...(groupAvatarFile ? { avatarFile: groupAvatarFile } : {}),
        }),
      })

      onCreated(res)
      onClose()
      setSelected([])
      setGroupName('')
      setGroupDescription('')
      setGroupAvatarFile(null)
      if (groupAvatarPreview) URL.revokeObjectURL(groupAvatarPreview)
      setGroupAvatarPreview(null)
      setQuery('')
      setResults([])
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Не удалось создать чат';
      notify.error(message);
    } finally {
      setLoading(false)
    }
  }

  const handleGroupAvatarChange = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify.error('Можно загрузить только изображение');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify.error('Максимальный размер аватара 5MB');
      return;
    }
    if (groupAvatarPreview) URL.revokeObjectURL(groupAvatarPreview);
    setGroupAvatarFile(file);
    setGroupAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-card w-full max-w-md rounded-xl shadow-xl p-5 text-muted-foreground">

        <h2 className="text-lg font-semibold mb-3">
          Create chat
        </h2>

        {/* search */}
        <input
          value={query}
          onChange={(e)=>search(e.target.value)}
          placeholder="Search users..."
          className="w-full border rounded-lg px-3 py-2 mb-3 text-muted-foreground"
        />

        {/* results */}
        <div className="max-h-40 overflow-y-auto border rounded-lg text-muted-foreground">
          {results.map(user => (
            <div
              key={user.id}
              onClick={()=>toggleUser(user)}
              className={`px-3 py-2 cursor-pointer hover:bg-muted flex justify-between ${
                selected.some(u => u.id === user.id)
                  ? 'bg-blue-50'
                  : ''
              }`}
            >
              @{user.display}

              {selected.some(u => u.id === user.id) && (
                <span className="text-muted-foreground">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* selected */}
        {!!selected.length && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.map(u => (
              <div
                key={u.id}
                className="bg-blue-100 text-muted-foreground px-2 py-1 rounded text-sm"
              >
                @{u.display}
              </div>
            ))}
          </div>
        )}

        {/* group name and description (only when 2+ participants) */}
        {selected.length > 1 && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Group avatar (optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleGroupAvatarChange(e.target.files?.[0])}
                  />
                </label>
                {groupAvatarPreview && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                    <img src={groupAvatarPreview} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        if (groupAvatarPreview) URL.revokeObjectURL(groupAvatarPreview);
                        setGroupAvatarFile(null);
                        setGroupAvatarPreview(null);
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Group chat name <span className="text-red-500">*</span>
              </label>
              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full border rounded-lg px-3 py-2 text-muted-foreground"
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Description (optional)
              </label>
              <textarea
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Short description..."
                className="w-full border rounded-lg px-3 py-2 text-muted-foreground resize-none"
                rows={2}
                maxLength={500}
              />
            </div>
          </div>
        )}

        {/* buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border text-muted-foreground"
          >
            Cancel
          </button>

          <button
            disabled={
              !selected.length ||
              loading ||
              (selected.length > 1 && !groupName.trim())
            }
            onClick={handleCreate}
            className="px-3 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>

      </div>
    </div>
  )
}
