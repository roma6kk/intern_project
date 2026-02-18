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
  assets?: { url: string; type?: string }[];
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
