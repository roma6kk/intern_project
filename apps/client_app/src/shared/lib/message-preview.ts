import { extractPostIdFromText } from '@/shared/lib/post-link';

function getStoryPreviewLabel(content: string | null | undefined): string | null {
  const raw = (content ?? '').trim();
  if (!raw) return null;
  if (raw.startsWith('[story-reaction]')) return 'Реакция на историю';
  if (raw.startsWith('[story-reply]')) return 'Ответ на историю';
  return null;
}

export function getMessagePreviewText(params: {
  content?: string | null;
  deletedAt?: string | null;
  assetsCount?: number;
}): string {
  if (params.deletedAt) return 'Сообщение удалено';

  const storyLabel = getStoryPreviewLabel(params.content);
  if (storyLabel) return storyLabel;

  if (extractPostIdFromText(params.content)) return 'Поделился постом';

  const text = (params.content ?? '').trim();
  if (text) return text;

  if ((params.assetsCount ?? 0) > 0) return `Вложения (${params.assetsCount})`;

  return 'Нет сообщений';
}

