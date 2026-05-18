/** Must match core `ALLOWED_STORY_REACTION_EMOJIS`. */
export const STORY_QUICK_REACTIONS = [
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

export type StoryQuickReaction = (typeof STORY_QUICK_REACTIONS)[number];
