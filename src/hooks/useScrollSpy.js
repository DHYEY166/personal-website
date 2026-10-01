import { useState, useEffect } from 'react';

/**
 * Returns the id of the section crossing a line 30% from the top of the viewport.
 * Returns '' while the hero (or anything above the first section) is in view.
 * Pass a stable `sectionIds` array (e.g. a module-level constant).
 */
export function useScrollSpy(sectionIds, enabled = true) {
  const [active, setActive] = useState('');
  const key = sectionIds.join('|');

  useEffect(() => {
    if (!enabled) {
      setActive('');
      return undefined;
    }

    const ids = key.split('|');
    const update = () => {
      const line = window.innerHeight * 0.3;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [key, enabled]);

  return active;
}
