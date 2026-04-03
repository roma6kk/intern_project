'use client';

import { MentionsInput, Mention, SuggestionDataItem } from 'react-mentions';
import api from '@/shared/api';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  inputId?: string;
}

export function MentionTextarea({
  value,
  onChange,
  placeholder,
  className,
  inputId,
}: Props) {

  const fetchUsers = async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
    if (!query) {
      callback([]);
      return;
    }

    try {
      const res = await api.get(`/profiles/search?query=${query}`);
      const profiles = res?.data ?? [];

      const users = profiles.map((profile: { user: { account: { username: string } } }) => ({
        id: profile.user.account.username,
        display: profile.user.account.username
      }));
      
      callback(users);
    } catch {
      callback([]);
    }
  };

  const renderSuggestion = (suggestion: SuggestionDataItem, _search: string, _highlightedDisplay: React.ReactNode, _index: number, focused: boolean) => (
    <div
      style={{
        padding: '8px 12px',
        background: focused ? 'var(--muted)' : 'var(--card)',
        color: 'var(--foreground)',
        cursor: 'pointer'
      }}
    >
      @{suggestion.display}
    </div>
  );

  return (
    <MentionsInput
      id={inputId}
      value={value || ''}
      onChange={(e: { target: { value: string } }) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      allowSuggestionsAboveCursor
      style={{
        control: {
          fontSize: 14,
          width: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          minHeight: '40px',
          padding: '8px 12px'
        },
        input: {
          margin: 0,
          padding: 0,
          border: 0,
          outline: 'none',
          minHeight: '24px',
          boxSizing: 'border-box'
        },
        highlighter: {
          margin: 0,
          padding: 0,
          pointerEvents: 'none',
          boxSizing: 'border-box'
        },      
        suggestions: {
          list: {
            background: 'var(--card)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
            borderRadius: 10,
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            zIndex: 999999
          },
          item: {
            padding: '8px 12px',
            color: 'var(--foreground)',
            '&focused': {
              background: 'var(--muted)',
              color: 'var(--foreground)'
            }
          }
        }
      }}
    >
      <Mention
        trigger="@"
        data={fetchUsers}
        markup="@[__display__](__id__)"
        displayTransform={(id: string) => `@${id}`}
        renderSuggestion={renderSuggestion}
        appendSpaceOnAdd
      />
    </MentionsInput>
  );
}
