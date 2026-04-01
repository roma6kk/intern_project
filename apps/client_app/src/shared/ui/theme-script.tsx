'use client';

/** Inline script runs before paint to avoid theme FOUC. Must match ThemeContext STORAGE_KEY / resolve logic. */
const THEME_SCRIPT = `(function(){try{var k='rika-theme';var s=localStorage.getItem(k);var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=s==='dark'||(s!=='light'&&d);document.documentElement.classList.toggle('dark',dark);}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
