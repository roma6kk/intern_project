export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId?: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    id: string;
    username?: string;
    account?: {
      username: string;
    };
    profile?: {
      firstName?: string;
      avatarUrl?: string;
    };
  };
  likesCount?: number;
  repliesCount?: number;
  replies?: Comment[];
  liked?: boolean;
  _count?: {
    children?: number;
    likes?: number;
  };
}

export interface CommentResponse {
  data: Comment[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateCommentPayload {
  postId: string;
  content: string;
  parentId?: string;
}
