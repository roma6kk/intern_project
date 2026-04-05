import { AssistantErrorCode } from '../contracts/assistant-api.types';
import type {
  ChatQaData,
  DialogSummaryData,
  TopicSuggestionsData,
} from '../contracts/assistant-api.types';

export type ParseResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: typeof AssistantErrorCode.PARSE_ERROR; message: string };

function extractJsonObject(raw: string): string | null {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    return trimmed;
  }
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(trimmed);
  if (fence?.[1]) {
    const inner = fence[1].trim();
    if (inner.startsWith('{')) return inner;
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return null;
}

export function parseTopicSuggestionsJson(
  raw: string,
): ParseResult<TopicSuggestionsData> {
  const jsonStr = extractJsonObject(raw);
  if (!jsonStr) {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'No JSON object in LLM output',
    };
  }
  try {
    const v = JSON.parse(jsonStr) as Record<string, unknown>;
    const suggestions = v.suggestions;
    const tone = typeof v.tone === 'string' ? v.tone : 'neutral';
    const confidence =
      typeof v.confidence === 'number' && !Number.isNaN(v.confidence)
        ? Math.min(1, Math.max(0, v.confidence))
        : 0.5;
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return {
        ok: false,
        code: AssistantErrorCode.PARSE_ERROR,
        message: 'Invalid suggestions array',
      };
    }
    const strings = suggestions.filter((s) => typeof s === 'string') as string[];
    if (strings.length === 0) {
      return {
        ok: false,
        code: AssistantErrorCode.PARSE_ERROR,
        message: 'Suggestions must be strings',
      };
    }
    return {
      ok: true,
      data: {
        suggestions: strings.slice(0, 8),
        tone,
        confidence,
      },
    };
  } catch {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'JSON parse failed',
    };
  }
}

export function parseDialogSummaryJson(raw: string): ParseResult<DialogSummaryData> {
  const jsonStr = extractJsonObject(raw);
  if (!jsonStr) {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'No JSON object in LLM output',
    };
  }
  try {
    const v = JSON.parse(jsonStr) as Record<string, unknown>;
    const summary = typeof v.summary === 'string' ? v.summary.trim() : '';
    const actionItems = Array.isArray(v.actionItems)
      ? (v.actionItems.filter((x) => typeof x === 'string') as string[])
      : [];
    if (!summary) {
      return {
        ok: false,
        code: AssistantErrorCode.PARSE_ERROR,
        message: 'Missing summary',
      };
    }
    return { ok: true, data: { summary, actionItems: actionItems.slice(0, 12) } };
  } catch {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'JSON parse failed',
    };
  }
}

export function parseChatQaJson(raw: string): ParseResult<ChatQaData> {
  const jsonStr = extractJsonObject(raw);
  if (!jsonStr) {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'No JSON object in LLM output',
    };
  }
  try {
    const v = JSON.parse(jsonStr) as Record<string, unknown>;
    const answer = typeof v.answer === 'string' ? v.answer.trim() : '';
    const citationsRaw = Array.isArray(v.citations) ? v.citations : [];
    const citations = citationsRaw
      .map((c) => {
        if (!c || typeof c !== 'object') return null;
        const o = c as Record<string, unknown>;
        const messageId =
          typeof o.messageId === 'string' ? o.messageId : '';
        const excerpt = typeof o.excerpt === 'string' ? o.excerpt : '';
        if (!messageId || !excerpt) return null;
        return { messageId, excerpt };
      })
      .filter(Boolean) as ChatQaData['citations'];
    if (!answer) {
      return {
        ok: false,
        code: AssistantErrorCode.PARSE_ERROR,
        message: 'Missing answer',
      };
    }
    return { ok: true, data: { answer, citations } };
  } catch {
    return {
      ok: false,
      code: AssistantErrorCode.PARSE_ERROR,
      message: 'JSON parse failed',
    };
  }
}
