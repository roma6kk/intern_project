import api from '../api';

export interface LikeToggleResponse {
  liked: boolean;
  message: string;
}

/**
 * Toggle like on a post
 * @param postId - Post ID
 * @returns Response with liked status
 */
export const togglePostLike = async (postId: string): Promise<LikeToggleResponse> => {
  const res = await api.post(`/likes/post/${postId}`);
  return res.data;
};

/**
 * Get list of users who liked a post
 * @param postId - Post ID
 * @returns Array of users who liked the post
 */
export const getPostLikes = async (postId: string) => {
  const res = await api.get(`/likes/post/${postId}`);
  return res.data;
};

/**
 * Check if current user liked a post (based on likes list)
 * @param postId - Post ID
 * @param userId - Current user ID
 * @returns true if user liked the post
 */
export const checkUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const likes = await getPostLikes(postId);
    return likes.some((like: { author?: { id?: string } }) => like.author?.id === userId);
  } catch (err) {
    console.error('Error checking if user liked post:', err);
    return false;
  }
};