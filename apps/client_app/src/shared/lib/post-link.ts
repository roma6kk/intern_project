const POST_LINK_REGEX = /(?:https?:\/\/[^\s/]+)?\/post\/([^\s?#/]+)(?:[?#][^\s]*)?/i;

export function extractPostIdFromText(content: string | null | undefined): string | null {
  const raw = (content ?? '').trim();
  if (!raw) return null;
  const match = raw.match(POST_LINK_REGEX);
  return match?.[1] ?? null;
}

export function isStandalonePostLink(content: string | null | undefined): boolean {
  const raw = (content ?? '').trim();
  if (!raw) return false;
  return /^(?:https?:\/\/[^\s/]+)?\/post\/([^\s?#/]+)(?:[?#][^\s]*)?$/i.test(raw);
}

export function stripPostLinks(content: string | null | undefined): string {
  const raw = (content ?? '').trim();
  if (!raw) return '';
  return raw.replace(new RegExp(POST_LINK_REGEX.source, 'ig'), '').replace(/\s{2,}/g, ' ').trim();
}
