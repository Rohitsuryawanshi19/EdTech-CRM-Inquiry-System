import { useEffect } from 'react';

/**
 * useScrollReveal — Triggers 400ms fade & 12px rise once when elements enter viewport.
 * Uses native IntersectionObserver. Respects prefers-reduced-motion.
 */
export const useScrollReveal = (dependency) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If user prefers reduced motion, reveal immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal:not(.is-revealed)');
    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [dependency]);
};

export default useScrollReveal;
