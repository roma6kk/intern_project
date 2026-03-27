export type User = {
  id?: string;
  username?: string;
  profile?: {
    firstName?: string;
    avatarUrl?: string;
  };
  account?: {
    username?: string;
  };
};

export type Post = {
  id: string;
  description?: string;
  isArchived: boolean;
  assets?: { id: string; url: string; type?: string }[];
  files?: { url: string; type?: string }[];
  media?: { url: string; type?: string }[];
  author?: User;
  authorId?: string;
  createdAt?: string;
  likesCount?: number;
  likes?: number;
  commentsCount?: number;
};

export type Notification = {
  id: string;
  isRead: boolean;
  type: string;
  recipientId: string;
  actorId: string;
  itemId?: string;
  postId?: string;
  createdAt: string;
};

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

export interface Account {
  id: string;
  userId: string;
  username: string;
  email?: string;
  phoneNumber?: string;
  passwordHash?: string;
  updatedAt?: Date;
}

export interface Profile {
  id: string;
  userId: string;
  firstName: string;
  secondName?: string;
  avatarUrl?: string;
  bio?: string;
  birthday?: Date;
  isPrivate: boolean;
}