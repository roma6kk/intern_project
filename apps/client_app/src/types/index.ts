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
  author?: User;
  authorId?: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
};
