import {
  fallbackChatQa,
  fallbackDialogSummary,
  fallbackTopicSuggestions,
} from './fallback-responses';

describe('fallback-responses', () => {
  it('fallbackTopicSuggestions returns generic when no messages', () => {
    const r = fallbackTopicSuggestions([]);
    expect(r.suggestions.length).toBeGreaterThan(0);
    expect(r.tone).toBe('casual');
  });

  it('fallbackTopicSuggestions uses last message when present', () => {
    const r = fallbackTopicSuggestions([
      {
        id: 'm1',
        senderId: 'u2',
        content: 'привет всем',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
    ]);
    expect(r.suggestions[0]).toMatch(/привет всем/i);
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
