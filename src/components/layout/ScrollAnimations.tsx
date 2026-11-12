'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Tiny stand-in for AOS: reveals any element with data-aos when it scrolls into view.
 * Honors data-aos-delay and data-aos-duration (ms) just like the old AOS.init({ once: true }).
 */
export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('aos-ready');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.aosDelay;
          const duration = el.dataset.aosDuration;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          if (duration) el.style.transitionDuration = `${duration}ms`;
          el.classList.add('aos-animate');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.05 },
    );

    const observeAll = (root: ParentNode = document) =>
      root.querySelectorAll<HTMLElement>('[data-aos]:not(.aos-animate)').forEach((el) => io.observe(el));

    observeAll();
    // Catch elements rendered later (tab panels, client components)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  return null;
}
