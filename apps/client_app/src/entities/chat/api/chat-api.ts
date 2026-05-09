import api from '@/shared/api';
import type { Chat, Message } from '../model/types';

export const getUserChats = async (): Promise<Chat[]> => {
  const { data } = await api.get('/chats');
  return data;
};

export const getOnlineUsers = async (): Promise<string[]> => {
  const { data } = await api.get('/chats/online');
  return Array.isArray(data) ? data : [];
};

export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  const { data } = await api.get(`/chats/${chatId}`);
  return data.messages || [];
};

const MAX_FILES = 10;

export const sendMessage = async (
  chatId: string,
  content: string,
  files?: File[],
  replyToId?: string | null,
) => {
  if (files?.length) {
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('content', content ?? '');
    if (replyToId) formData.append('replyToId', replyToId);
    const toSend = files.slice(0, MAX_FILES);
    toSend.forEach((file) => formData.append('files', file));
    const { data } = await api.post('/messages', formData);
    return data;
  }
  const { data } = await api.post('/messages', {
    chatId,
    content,
    ...(replyToId && { replyToId }),
  });
  return data;
};

export const updateMessage = async (
  messageId: string,
  body: { content?: string },
  files?: File[],
): Promise<Message> => {
  if (files?.length) {
    const formData = new FormData();
    formData.append('content', body.content ?? '');
    files.slice(0, MAX_FILES).forEach((file) => formData.append('files', file));
    const { data } = await api.patch(`/messages/${messageId}`, formData);
    return data;
  }
  const { data } = await api.patch(`/messages/${messageId}`, body);
  return data;
};

export const deleteMessage = async (messageId: string): Promise<{ id: string; deleted: boolean }> => {
  const { data } = await api.delete(`/messages/${messageId}`);
  return data;
};

export interface CreateChatParams {
  memberIds: string[];
  name?: string;
  description?: string;
  type?: 'PRIVATE' | 'GROUP';
  avatarFile?: File;
}

export const createChat = async (params: CreateChatParams | string[]) => {
  const body =
    typeof params === 'object' && !Array.isArray(params)
      ? params
      : { memberIds: params };

  if (typeof body === 'object' && body.avatarFile) {
    const formData = new FormData();
    formData.append('file', body.avatarFile);
    formData.append('type', body.type ?? 'PRIVATE');
    body.memberIds.forEach((id) => formData.append('memberIds', id));
    if (body.name != null) formData.append('name', body.name);
    if (body.description != null) formData.append('description', body.description);
    const { data } = await api.post('/chats', formData);
    return data;
  }

  const { data } = await api.post('/chats', body);
  return data;
};

export const markChatAsRead = async (chatId: string) => {
  const { data } = await api.patch(`/messages/chat/${chatId}/read`);
  return data;
};

export interface UpdateChatParams {
  addMemberIds?: string[];
  removeMemberIds?: string[];
  leaveChat?: boolean;
  newAdminId?: string;
  promoteToAdminId?: string;
  name?: string;
  description?: string;
  avatarFile?: File;
  removeAvatar?: boolean;
}

export const updateChat = async (chatId: string, payload: UpdateChatParams) => {
  if (payload.avatarFile) {
    const formData = new FormData();
    formData.append('file', payload.avatarFile);
    if (payload.name !== undefined) formData.append('name', payload.name);
    if (payload.description !== undefined) formData.append('description', payload.description);
    if (payload.removeAvatar !== undefined) formData.append('removeAvatar', String(payload.removeAvatar));
    if (payload.leaveChat !== undefined) formData.append('leaveChat', String(payload.leaveChat));
    if (payload.newAdminId) formData.append('newAdminId', payload.newAdminId);
    if (payload.promoteToAdminId) formData.append('promoteToAdminId', payload.promoteToAdminId);
    payload.addMemberIds?.forEach((id) => formData.append('addMemberIds', id));
    payload.removeMemberIds?.forEach((id) => formData.append('removeMemberIds', id));
    const { data } = await api.patch(`/chats/${chatId}`, formData);
    return data;
  }

  const { data } = await api.patch(`/chats/${chatId}`, payload);
  return data;
};

export const updateChatMembers = async (
  chatId: string,
  addMemberIds?: string[],
  removeMemberIds?: string[],
) => {
  return updateChat(chatId, { addMemberIds, removeMemberIds });
};

export const leaveChat = async (chatId: string, newAdminId?: string) => {
  return updateChat(chatId, { leaveChat: true, newAdminId });
};

export const updateChatInfo = async (
  chatId: string,
  info: { name?: string; description?: string; avatarFile?: File; removeAvatar?: boolean },
) => {
  return updateChat(chatId, info);
};

export const promoteToAdmin = async (chatId: string, userId: string) => {
  return updateChat(chatId, { promoteToAdminId: userId });
};
