import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-30% 0px -70% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, [sectionIds]);

  return active;
}
