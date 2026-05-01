/** Allowed quick reactions; must stay in sync with client story viewer. */
export const ALLOWED_STORY_REACTION_EMOJIS = [
  '❤️',
  '🔥',
  '😂',
  '😮',
  '👏',
  '💯',
  '🎉',
  '😍',
  '🤯',
  '👍',
  '✨',
  '😭',
  '🙌',
  '💀',
] as const;

export const ALLOWED_STORY_REACTION_SET = new Set<string>(
  ALLOWED_STORY_REACTION_EMOJIS,
);
