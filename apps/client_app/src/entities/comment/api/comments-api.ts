import api from '@/shared/api';
import type { Comment, CommentResponse, CreateCommentPayload } from '../model/types';

export const createComment = async (payload: CreateCommentPayload): Promise<Comment> => {
  const res = await api.post('/comments', payload);
  return res.data;
};

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

export const getCommentReplies = async (commentId: string): Promise<Comment[]> => {
  const res = await api.get(`/comments/${commentId}/replies`);
  return res.data;
};

export const updateComment = async (commentId: string, content: string): Promise<Comment> => {
  const res = await api.patch(`/comments/${commentId}`, { content });
  return res.data;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await api.delete(`/comments/${commentId}`);
};

export const toggleCommentLike = async (commentId: string) => {
  const res = await api.post(`/likes/comment/${commentId}`);
  return res.data;
};

export const getCommentLikes = async (commentId: string) => {
  const res = await api.get(`/likes/comment/${commentId}`);
  return res.data;
};
