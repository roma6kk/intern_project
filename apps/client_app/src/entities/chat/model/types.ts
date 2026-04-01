export type ChatRole = 'ADMIN' | 'MEMBER';

export interface ChatMember {
  id: string;
  role?: ChatRole;
  profile?: {
    firstName: string;
    secondName?: string;
    avatarUrl: string | null;
  };
  account?: {
    username: string;
  };
}

export interface Message {
  id: string;
  content: string | null;
  senderId: string;
  chatId: string;
  createdAt: string;
  isRead: boolean;
  isEdited?: boolean;
  deletedAt?: string | null;
  replyToId?: string | null;
  replyTo?: Message | null;
  assets?: { id: string; url: string; type?: string }[];
  sender: {
    id: string;
    profile?: {
      firstName: string;
      avatarUrl: string | null;
    };
    account?: {
      username: string;
    };
  };
}

export interface Chat {
  id: string;
  name?: string;
  description?: string;
  type: 'PRIVATE' | 'GROUP';
  members: ChatMember[];
  creator?: ChatMember;
  creatorId?: string;
  messages?: Message[];
  updatedAt: string;
}
