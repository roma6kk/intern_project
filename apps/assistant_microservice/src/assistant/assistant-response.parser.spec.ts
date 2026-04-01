import {
  parseChatQaJson,
  parseDialogSummaryJson,
  parseTopicSuggestionsJson,
} from './assistant-response.parser';
import { AssistantErrorCode } from '../contracts/assistant-api.types';

describe('assistant-response.parser', () => {
  it('parseTopicSuggestionsJson accepts raw JSON', () => {
    const r = parseTopicSuggestionsJson(
      '{"suggestions":["a","b"],"tone":"casual","confidence":0.8}',
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.suggestions).toEqual(['a', 'b']);
      expect(r.data.tone).toBe('casual');
      expect(r.data.confidence).toBe(0.8);
    }
  });

  it('parseTopicSuggestionsJson extracts from fenced block', () => {
    const r = parseTopicSuggestionsJson(
      'Here:\n```json\n{"suggestions":["x"],"tone":"neutral","confidence":1}\n```',
    );
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.suggestions).toEqual(['x']);
  });

  it('parseTopicSuggestionsJson fails on invalid', () => {
    const r = parseTopicSuggestionsJson('not json');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe(AssistantErrorCode.PARSE_ERROR);
  });

  it('parseDialogSummaryJson', () => {
    const r = parseDialogSummaryJson(
      '{"summary":"Hello","actionItems":["do x"]}',
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.summary).toBe('Hello');
      expect(r.data.actionItems).toEqual(['do x']);
    }
  });

  it('parseChatQaJson', () => {
    const r = parseChatQaJson(
      '{"answer":"Yes","citations":[{"messageId":"u1","excerpt":"hi"}]}',
    );
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.answer).toBe('Yes');
      expect(r.data.citations).toHaveLength(1);
    }
  });
});
