const VIDEO_EXT_RE = /\.(mp4|webm|ogg|mov|m4v|ogv|mkv)(?:$|[?#])/i;

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;

  // Fast-path for typical URLs (including signed URLs with query params).
  if (VIDEO_EXT_RE.test(url)) return true;

  // Robust path check for cases where query contains dots etc.
  try {
    const u = new URL(url);
    return VIDEO_EXT_RE.test(u.pathname);
  } catch {
    // If it's a relative path or malformed URL, fall back to string check.
    return VIDEO_EXT_RE.test(url);
  }
}

