import { useEffect } from 'react';

const SITE_URL = 'https://personal-website-dun-eta-72.vercel.app';

/** Sets document.title and the canonical URL for a route, restoring them on unmount. */
export function usePageMeta({ title, path }) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    const previousHref = canonical?.getAttribute('href');
    if (title) document.title = title;
    if (canonical && path) canonical.setAttribute('href', `${SITE_URL}${path}`);
    return () => {
      document.title = previousTitle;
      if (canonical && previousHref) canonical.setAttribute('href', previousHref);
    };
  }, [title, path]);
}
