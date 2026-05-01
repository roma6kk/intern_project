/** Mirrors assistant_microservice contract for typed proxy responses */

export const AssistantErrorCode = {
  VALIDATION: 'VALIDATION',
  LLM_TIMEOUT: 'LLM_TIMEOUT',
  LLM_ERROR: 'LLM_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  MISSING_CONTEXT: 'MISSING_CONTEXT',
} as const;

export type AssistantErrorCodeType =
  (typeof AssistantErrorCode)[keyof typeof AssistantErrorCode];

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
