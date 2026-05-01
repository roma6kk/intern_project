import api from '@/shared/api';
import type { Post } from '../model/types';

export const updatePost = async (
  postId: string,
  description: string,
  files?: File[],
  deleteAssetIds?: string[]
): Promise<Post> => {
  const formData = new FormData();
  formData.append('description', description);
  
  if (deleteAssetIds && deleteAssetIds.length > 0) {
    deleteAssetIds.forEach((id) => {
      formData.append('deleteAssetIds', id);
    });
  }
  
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('files', file);
    });
  }
  
  const res = await api.patch(`/posts/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};

export const archivePost = async (id: string) => {
  const { data } = await api.patch(`/posts/${id}/archive`);
  return data;
};
