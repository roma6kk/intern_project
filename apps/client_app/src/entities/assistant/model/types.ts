export type AssistantErrorCode =
  | 'VALIDATION'
  | 'LLM_TIMEOUT'
  | 'LLM_ERROR'
  | 'PARSE_ERROR'
  | 'MISSING_CONTEXT';

export interface AssistantMeta {
  source: 'llm' | 'fallback';
  llmError?: AssistantErrorCode;
}

export type AssistantEnvelope<T> =
  | { success: true; data: T; meta?: AssistantMeta }
  | {
      success: false;
      code: AssistantErrorCode;
      message: string;
      fallback?: unknown;
    };

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
