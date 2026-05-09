import type { User } from '@/entities/user';

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
