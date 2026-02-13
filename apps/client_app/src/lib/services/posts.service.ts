import api from '../api';
import { Post } from '@/types';

/**
 * Update a post
 * @param postId - Post ID
 * @param description - Updated description
 * @returns Updated post
 */
export const updatePost = async (postId: string, description: string): Promise<Post> => {
  const res = await api.patch(`/posts/${postId}`, { description });
  return res.data;
};

/**
 * Delete a post
 * @param postId - Post ID
 */
export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};
