import api from '@/lib/api';
import { Chat, Message } from '@/types/index';

export const getUserChats = async (): Promise<Chat[]> => {
  const { data } = await api.get('/chats');
  return data;
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
}

export const createChat = async (params: CreateChatParams | string[]) => {
  const body =
    typeof params === 'object' && !Array.isArray(params)
      ? params
      : { memberIds: params };
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
}

export const updateChat = async (chatId: string, payload: UpdateChatParams) => {
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
  info: { name?: string; description?: string },
) => {
  return updateChat(chatId, info);
};

export const promoteToAdmin = async (chatId: string, userId: string) => {
  return updateChat(chatId, { promoteToAdminId: userId });
};