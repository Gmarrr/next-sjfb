'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { signOut } from '@/lib/admin/actions';
import { useDebounced, useRealtime, type LiveChange, type LiveStatus } from '@/lib/realtime';

type Props = { children: ReactNode; admin: { email: string; full_name: string | null; role: 'owner' | 'editor' }; newMessages: number };
type Toast = { id: number; title: string; text: string; href?: string };

const I = (d: string, cls = 'size-[18px]') => <svg className={`${cls} shrink-0`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { section: 'Content' },
  { href: '/admin/events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { href: '/admin/blogs', label: 'Blogs', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15' },
  { href: '/admin/markets', label: 'Ports & Teams', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '/admin/content', label: 'Page Content', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { section: 'People' },
  { href: '/admin/inquiries', label: 'Messages', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: true },
  { href: '/admin/subscribers', label: 'Subscribers', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
  { href: '/admin/users', label: 'Admin Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', owner: true },
] as const;

const ALL_TABLES = ['inquiries', 'subscribers', 'events', 'blogs', 'markets', 'market_members', 'site_content'];

/** Pages with an open form: don't auto-refresh under the user's cursor. */
const isEditingPage = (p: string) => /\/(new|account)$/.test(p) || /\/admin\/(events|blogs|markets)\/\d+/.test(p) || /\/admin\/content\/[^/]+$/.test(p);

function LivePill({ status }: { status: LiveStatus }) {
  const map = {
    live: { dot: 'bg-emerald-500', ring: 'bg-emerald-400', text: 'Live', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', title: 'Connected — updates appear instantly' },
    connecting: { dot: 'bg-amber-500', ring: 'bg-amber-400', text: 'Connecting', cls: 'text-amber-700 bg-amber-50 border-amber-200', title: 'Connecting to live updates…' },
    offline: { dot: 'bg-slate-400', ring: 'bg-slate-300', text: 'Offline', cls: 'text-slate-500 bg-slate-50 border-slate-200', title: 'Live updates unavailable — run supabase/realtime.sql, or check your connection' },
  }[status];
  return (
    <span title={map.title} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.7rem] font-bold uppercase tracking-wide ${map.cls}`}>
      <span className="relative flex size-2">
        {status === 'live' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${map.ring}`} />}
        <span className={`relative inline-flex size-2 rounded-full ${map.dot}`} />
      </span>
      {map.text}
    </span>
  );
}

export default function AdminShell({ children, admin, newMessages }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unread, setUnread] = useState(newMessages);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => setUnread(newMessages), [newMessages]);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts.slice(-3), { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 9000);
  }, []);

  const refresh = useDebounced(() => { if (!isEditingPage(window.location.pathname)) router.refresh(); }, 800);

  // ── Realtime: one websocket for the whole admin panel ──
  const status = useRealtime('admin', ALL_TABLES, (c: LiveChange) => {
    if (c.table === 'inquiries' && c.eventType === 'INSERT') {
      const m = c.new as { id?: number; first_name?: string; last_name?: string; subject?: string };
      setUnread((n) => n + 1);
      pushToast({ title: 'New message', text: `${m.first_name ?? ''} ${m.last_name ?? ''} — ${m.subject ?? ''}`.trim(), href: m.id ? `/admin/inquiries/${m.id}` : '/admin/inquiries' });
    }
    if (c.table === 'subscribers' && c.eventType === 'INSERT') {
      pushToast({ title: 'New subscriber', text: String((c.new as { email?: string }).email ?? ''), href: '/admin/subscribers' });
    }
    refresh();
  });

  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
  const current = NAV.find((n) => 'href' in n && active(n.href)) as { label: string } | undefined;
  const name = admin.full_name || admin.email.split('@')[0];

  const sidebar = (
    <nav className="flex flex-col h-full">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-100 shrink-0">
        <img src="/assets/icons/logo.svg" alt="" className="size-8" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-slate-900">St. Joseph</p>
          <p className="text-[.65rem] font-bold uppercase tracking-widest text-orange-600">Website Admin</p>
        </div>
      </Link>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item, i) => {
          if ('section' in item) return <p key={i} className="px-3 pt-5 pb-1.5 text-[.65rem] font-bold uppercase tracking-widest text-slate-400">{item.section}</p>;
          if ('owner' in item && item.owner && admin.role !== 'owner') return null;
          const on = active(item.href);
          return (
            <Link key={item.href} href={item.href} className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${on ? 'bg-gradient-to-r from-orange-50 to-amber-50/40 text-orange-700 shadow-[inset_0_0_0_1px_rgba(251,146,60,.25)]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              {on && <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-orange-500" />}
              {I(item.icon)}
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && unread > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-orange-600 text-white text-[.7rem] font-bold flex items-center justify-center">{unread}</span>}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-100 p-3 space-y-1 shrink-0">
        <Link href="/admin/account" className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm ${active('/admin/account') ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <span className="size-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0">{name.charAt(0).toUpperCase()}</span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold truncate text-slate-800">{name}</span>
            <span className="block text-[.7rem] text-slate-400 capitalize">{admin.role}</span>
          </span>
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">
            {I('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1')}Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,rgba(251,146,60,.07),transparent_45%)] bg-slate-50">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200/80 z-30">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/95 backdrop-blur border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-2"><img src="/assets/icons/logo.svg" alt="" className="size-7" /><span className="text-sm font-extrabold">SJFB Admin</span></Link>
        <div className="flex items-center gap-2">
          <LivePill status={status} />
          <button type="button" onClick={() => setOpen(true)} className="size-9 rounded-lg border border-slate-200 flex items-center justify-center" aria-label="Open menu">
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </header>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Desktop top bar */}
        <div className="hidden lg:flex sticky top-0 z-20 h-16 items-center justify-between gap-4 px-6 bg-white/80 backdrop-blur border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/admin" className="text-slate-400 hover:text-slate-700">Admin</Link>
            {current && current.label !== 'Dashboard' && (<><span className="text-slate-300">/</span><span className="font-semibold text-slate-800">{current.label}</span></>)}
            {current?.label === 'Dashboard' && (<><span className="text-slate-300">/</span><span className="font-semibold text-slate-800">Dashboard</span></>)}
          </div>
          <div className="flex items-center gap-3">
            <LivePill status={status} />
            <Link href="/admin/inquiries?status=new" className="relative size-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-orange-600 hover:border-orange-200" title="New messages">
              {I('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9')}
              {unread > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-orange-600 text-white text-[.65rem] font-bold flex items-center justify-center ring-2 ring-white">{unread}</span>}
            </Link>
            <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300">
              {I('M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14', 'size-4')}View website
            </a>
          </div>
        </div>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      </div>

      {/* Live toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(92vw,360px)]" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="admin-toast flex items-start gap-3 rounded-2xl bg-slate-900 text-white shadow-2xl p-4 ring-1 ring-white/10">
            <span className="mt-0.5 size-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">{I('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', 'size-4')}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{t.title}</p>
              <p className="text-xs text-slate-300 truncate">{t.text}</p>
              {t.href && <Link href={t.href} onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="inline-block mt-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300">Open →</Link>}
            </div>
            <button type="button" onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="text-slate-400 hover:text-white text-lg leading-none" aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
