'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_LINKS } from '@/lib/site';

// Ported from components/navigation.php — shop cart, order tracking and sign-in were removed.
export default function Header({ logo, cta }: { logo: string; cta: string }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // drives the fade/slide class
  const menuRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Hide header on scroll down, show on scroll up (same thresholds as the PHP version)
  useEffect(() => {
    let last = 0;
    let ticking = false;
    const onScroll = () => {
      const y = window.pageYOffset || document.documentElement.scrollTop;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setHidden(y > 100 && y > last);
        last = y <= 0 ? 0 : y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openMenu = () => { setMenuOpen(true); setTimeout(() => setMenuVisible(true), 10); };
  const closeMenu = () => { setMenuVisible(false); setTimeout(() => setMenuOpen(false), 300); };

  // Close on outside click / resize / route change
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !buttonRef.current?.contains(t)) closeMenu();
    };
    const onResize = () => { if (window.innerWidth >= 1024) closeMenu(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { closeMenu(); buttonRef.current?.focus(); } };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize); };
  }, [menuOpen]);

  useEffect(() => { setMenuVisible(false); setMenuOpen(false); }, [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 flex flex-wrap md:justify-start md:flex-nowrap w-full py-2 bg-white shadow-xs transition-transform duration-300 ease-in-out ${hidden ? 'header-hidden' : 'header-visible'}`}
      >
        <nav aria-label="Main" className="main-nav relative max-w-7xl w-full grid px-4 md:px-6 mx-auto">
          <div className="flex items-center">
            <Link className="flex-none rounded-xl inline-block font-semibold" href="/" aria-label="St. Joseph Fish Brokerage — Home">
              <img src={logo} className="logo-big w-auto h-24 transition-all duration-500 hover:scale-110 filter drop-shadow-lg" alt="" />
              <img src={logo} className="lg:hidden logo-small w-auto h-14 transition-all duration-500 hover:scale-110 filter drop-shadow-lg" alt="" />
            </Link>
          </div>

          <div className="top-nav flex items-center justify-center gap-x-8 w-fit mx-auto bg-gray-100 border border-gray-200 rounded-full px-8 py-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                title={l.title}
                aria-current={isActive(l.href) ? 'page' : undefined}
                className={`${isActive(l.href) ? 'text-orange-600' : 'text-gray-700'} hover:text-orange-600 cursor-pointer text-sm font-medium rounded-xl transition-colors duration-200`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="nav-actions flex items-center justify-end gap-x-1">
            <div className="hidden md:flex items-center">
              <img src="/assets/icons/eos.png" className="h-10 w-auto opacity-80 hover:opacity-100 transition-opacity" alt="We Run on EOS" />
            </div>

            <Link
              href="/contact"
              className="min-h-11 py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold text-nowrap rounded-xl border border-transparent bg-orange-600 text-white hover:bg-orange-700 active:scale-[.98] transition"
            >
              {cta}
            </Link>

            {/* Mobile Navigation Dropdown */}
            <div className="relative inline-flex lg:hidden">
              <button
                ref={buttonRef}
                type="button"
                onClick={(e) => { e.stopPropagation(); if (menuOpen) closeMenu(); else openMenu(); }}
                className="size-11 flex justify-center items-center rounded-xl border border-gray-200 text-black hover:bg-gray-100 transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
              >
                {menuOpen ? (
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                ) : (
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></svg>
                )}
              </button>

              {menuOpen && (
                <nav id="mobile-menu" aria-label="Mobile" ref={menuRef as React.RefObject<HTMLElement>} className={`mobile-nav-menu ${menuVisible ? 'show' : ''} absolute top-full right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-xl z-50`}>
                  <div className="inline-flex px-4 py-3 border-b border-gray-100 text-center">
                    <img src="/assets/icons/eos.png" className="h-10 w-auto" alt="We Run on EOS" />
                    <p className="text-gray-600 text-xs my-auto ms-2 text-start">Entrepreneurial Operating System</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {NAV_LINKS.map((l) => (
                      <Link key={l.href} href={l.href} onClick={closeMenu} aria-current={isActive(l.href) ? 'page' : undefined} className={`w-full min-h-11 flex items-center gap-x-3 py-3 px-3.5 rounded-xl text-[15px] font-medium ${isActive(l.href) ? 'text-orange-600 bg-orange-50' : 'text-gray-800'} hover:bg-gray-100 transition-colors`}>
                        {l.label === 'About' ? 'About us' : l.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-16 md:pt-24" />
    </>
  );
}
