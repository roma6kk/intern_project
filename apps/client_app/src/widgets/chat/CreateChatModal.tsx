'use client'

import { useState } from 'react'
import api from '@/shared/api'
import { createChat } from '@/entities/chat'
import type { Chat } from '@/entities/chat'

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
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [selected, setSelected] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [loading, setLoading] = useState(false)

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

      setResults(users as User[])
    } catch {
      setResults([])
    }
  }

  const toggleUser = (user: User) => {
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
        }),
      })

      onCreated(res)
      onClose()
      setSelected([])
      setGroupName('')
      setGroupDescription('')
      setQuery('')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

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
