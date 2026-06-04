import api from '@/shared/api';

export interface LikeToggleResponse {
  liked: boolean;
  message: string;
}

export const togglePostLike = async (postId: string): Promise<LikeToggleResponse> => {
  const res = await api.post(`/likes/post/${postId}`);
  return res.data;
};

export const getPostLikes = async (postId: string) => {
  const res = await api.get(`/likes/post/${postId}`);
  return res.data;
};

export const checkUserLikedPost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const likes = await getPostLikes(postId);
    return likes.some((like: { author?: { id?: string } }) => like.author?.id === userId);
  } catch (err) {
    console.error('Error checking if user liked post:', err);
    return false;
  }
};
