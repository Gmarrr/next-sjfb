'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Thin orange bar at the top of the screen that starts the instant a link is clicked
 * and finishes when the new page is shown — so navigation never feels frozen.
 * Other code can start it too: window.dispatchEvent(new Event('nav-progress:start')).
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const active = useRef(false);

  const start = () => {
    if (active.current) return;
    active.current = true;
    setVisible(true);
    setWidth(12);
    if (timer.current) clearInterval(timer.current);
    // creep towards 90% while waiting for the server
    timer.current = setInterval(() => setWidth((w) => (w < 90 ? w + (90 - w) * 0.12 : w)), 250);
  };

  const done = () => {
    if (!active.current) return;
    active.current = false;
    if (timer.current) clearInterval(timer.current);
    setWidth(100);
    setTimeout(() => { setVisible(false); setWidth(0); }, 320);
  };

  // Route finished changing
  useEffect(() => { done(); }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-fancybox')) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };
    const onStart = () => start();
    const onDone = () => done();
    document.addEventListener('click', onClick, true);
    window.addEventListener('nav-progress:start', onStart);
    window.addEventListener('nav-progress:done', onDone);
    window.addEventListener('popstate', onStart);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('nav-progress:start', onStart);
      window.removeEventListener('nav-progress:done', onDone);
      window.removeEventListener('popstate', onStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;
  return <div className="nav-progress" style={{ width: `${width}%`, opacity: width >= 100 ? 0 : 1 }} role="progressbar" aria-label="Loading page" aria-valuenow={Math.round(width)} />;
}
