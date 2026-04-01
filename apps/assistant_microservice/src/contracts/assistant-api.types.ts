/** Error codes returned when success is false (client/core can branch on these). */
export const AssistantErrorCode = {
  VALIDATION: 'VALIDATION',
  LLM_TIMEOUT: 'LLM_TIMEOUT',
  LLM_ERROR: 'LLM_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  MISSING_CONTEXT: 'MISSING_CONTEXT',
} as const;

export type AssistantErrorCodeType =
  (typeof AssistantErrorCode)[keyof typeof AssistantErrorCode];

export interface RecentMessagePayload {
  id: string;
  senderId: string;
  content: string | null;
  createdAt: string;
}

export interface TargetUserProfilePayload {
  userId: string;
  username?: string;
  firstName?: string;
  secondName?: string;
  bio?: string | null;
  platformRole?: string;
  locale?: string;
}

export interface TopicSuggestionsData {
  suggestions: string[];
  tone: string;
  confidence: number;
}

export interface DialogSummaryData {
  summary: string;
  actionItems: string[];
}

export interface ChatCitation {
  messageId: string;
  excerpt: string;
}

export interface ChatQaData {
  answer: string;
  citations: ChatCitation[];
}

/** When LLM fails we may still return structured fallback data with meta.source=fallback */
export interface AssistantMeta {
  source: 'llm' | 'fallback';
  llmError?: AssistantErrorCodeType;
}

export type AssistantSuccessEnvelope<T> = {
  success: true;
  data: T;
  meta?: AssistantMeta;
};

export type AssistantFailureEnvelope = {
  success: false;
  code: AssistantErrorCodeType;
  message: string;
  fallback?: unknown;
};

export type AssistantEnvelope<T> =
  | AssistantSuccessEnvelope<T>
  | AssistantFailureEnvelope;
