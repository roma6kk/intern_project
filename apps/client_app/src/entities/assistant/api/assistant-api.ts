import api from '@/shared/api';
import type {
  AssistantEnvelope,
  ChatQaData,
  DialogSummaryData,
  TopicSuggestionsData,
} from '../model/types';

export async function assistantTopicSuggestions(
  chatId: string,
  targetUserId?: string,
): Promise<AssistantEnvelope<TopicSuggestionsData>> {
  const { data } = await api.post('/assistant/topic-suggestions', {
    chatId,
    ...(targetUserId ? { targetUserId } : {}),
  });
  return data;
}

export async function assistantDialogSummary(
  chatId: string,
  maxBullets?: number,
): Promise<AssistantEnvelope<DialogSummaryData>> {
  const { data } = await api.post('/assistant/dialog-summary', {
    chatId,
    ...(maxBullets != null ? { maxBullets } : {}),
  });
  return data;
}

export async function assistantChatQa(
  chatId: string,
  question: string,
): Promise<AssistantEnvelope<ChatQaData>> {
  const { data } = await api.post('/assistant/chat-qa', { chatId, question });
  return data;
}
