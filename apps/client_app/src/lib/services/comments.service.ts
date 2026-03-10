import api from '../api';

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

/**
 * Create a comment on a post
 * @param payload - Comment creation payload
 * @returns Created comment
 */
export const createComment = async (payload: CreateCommentPayload): Promise<Comment> => {
  const res = await api.post('/comments', payload);
  return res.data;
};

/**
 * Get root comments for a post
 * @param postId - Post ID
 * @param page - Page number (default 1)
 * @param limit - Items per page (default 10)
 * @returns List of root comments
 */
export const getPostComments = async (
  postId: string,
  page: number = 1,
  limit: number = 10
): Promise<CommentResponse> => {
  const res = await api.get(`/comments/post/${postId}`, {
    params: { page, limit },
  });
  return res.data;
};

/**
 * Get replies for a specific comment
 * @param commentId - Comment ID
 * @returns List of replies
 */
export const getCommentReplies = async (commentId: string): Promise<Comment[]> => {
  const res = await api.get(`/comments/${commentId}/replies`);
  return res.data;
};

/**
 * Update a comment
 * @param commentId - Comment ID
 * @param content - New content
 * @returns Updated comment
 */
export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const res = await api.patch(`/comments/${commentId}`, { content });
  return res.data;
};

/**
 * Delete a comment
 * @param commentId - Comment ID
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

/**
 * Toggle like on a comment
 * @param commentId - Comment ID
 * @returns Response with liked status
 */
export const toggleCommentLike = async (commentId: string) => {
  const res = await api.post(`/likes/comment/${commentId}`);
  return res.data;
};

/**
 * Get comment likes
 * @param commentId - Comment ID
 * @returns Array of users who liked the comment
 */
export const getCommentLikes = async (commentId: string) => {
  const res = await api.get(`/likes/comment/${commentId}`);
  return res.data;
};
