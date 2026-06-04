/** Normalizes query/body values into a string array (JSON array, comma-separated, or single UUID). */
export function parseUuidArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string');
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((v): v is string => typeof v === 'string');
        }
        return [trimmed];
      } catch {
        return [trimmed];
      }
    }
    return trimmed.includes(',')
      ? trimmed.split(',').map((v) => v.trim())
      : [trimmed];
  }
  return [];
}
