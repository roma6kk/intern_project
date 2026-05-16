import {
  fallbackChatQa,
  fallbackDialogSummary,
  fallbackTopicSuggestions,
} from './fallback-responses';

describe('fallback-responses', () => {
  it('fallbackTopicSuggestions returns generic when no bio', () => {
    const r = fallbackTopicSuggestions({
      userId: 'u1',
      username: 'alice',
    });
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.tone).toBe('casual');
  });

  it('fallbackDialogSummary empty messages', () => {
    const r = fallbackDialogSummary([], 5);
    expect(r.summary).toMatch(/нет сообщений/i);
  });

  it('fallbackChatQa no messages', () => {
    const r = fallbackChatQa('test?', []);
    expect(r.answer).toBeTruthy();
    expect(r.citations).toEqual([]);
  });
});
