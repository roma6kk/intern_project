import type { Message } from './types';

/** Chat list previews may omit top-level senderId; nested sender.id is present. */
export function lastMessageIsUnreadIncomingForUser(
  lastMessage: Message & { sender_id?: string; sender?: { id?: string } | null },
  myUserId: string
): boolean {
  if (lastMessage.isRead) return false;
  const senderId =
    lastMessage.senderId ??
    lastMessage.sender_id ??
    lastMessage.sender?.id;
  if (!senderId) return false;
  return senderId !== myUserId;
}
