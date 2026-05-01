'use client';

interface MentionTextProps {
  text: string;
  className?: string;
}

export function MentionText({ text, className = '' }: MentionTextProps) {
  const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    const display = match[1];
    const username = match[2];
    
    parts.push(
      <a
        key={match.index}
        href={`/profile/${username}`}
        className="text-blue-600 hover:underline font-medium"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        @{display}
      </a>
    );
    
    lastIndex = mentionRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
