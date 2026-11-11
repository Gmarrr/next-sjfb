'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { signOut } from '@/lib/admin/actions';

type Props = { children: ReactNode; admin: { email: string; full_name: string | null; role: 'owner' | 'editor' }; newMessages: number };

const I = (d: string) => <svg className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={d} /></svg>;

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: I('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6') },
  { section: 'Content' },
  { href: '/admin/events', label: 'Events', icon: I('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z') },
  { href: '/admin/blogs', label: 'Blogs', icon: I('M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15') },
  { href: '/admin/markets', label: 'Ports & Teams', icon: I('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z') },
  { href: '/admin/content', label: 'Page Content', icon: I('M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z') },
  { section: 'People' },
  { href: '/admin/inquiries', label: 'Messages', icon: I('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'), badge: true },
  { href: '/admin/subscribers', label: 'Subscribers', icon: I('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9') },
  { href: '/admin/users', label: 'Admin Users', icon: I('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'), owner: true },
] as const;

export default function AdminShell({ children, admin, newMessages }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));
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
          if ('section' in item) return <p key={i} className="px-3 pt-4 pb-1 text-[.65rem] font-bold uppercase tracking-widest text-slate-400">{item.section}</p>;
          if ('owner' in item && item.owner && admin.role !== 'owner') return null;
          const on = active(item.href);
          return (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${on ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && newMessages > 0 && <span className="min-w-5 h-5 px-1.5 rounded-full bg-orange-600 text-white text-[.7rem] font-bold flex items-center justify-center">{newMessages}</span>}
            </Link>
          );
        })}
      </div>
      <div className="border-t border-slate-100 p-3 space-y-1 shrink-0">
        <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
          {I('M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14')}View website
        </a>
        <Link href="/admin/account" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${active('/admin/account') ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}>
          <span className="size-[18px] rounded-full bg-orange-100 text-orange-700 text-[.65rem] font-bold flex items-center justify-center shrink-0">{name.charAt(0).toUpperCase()}</span>
          <span className="flex-1 min-w-0">
            <span className="block font-medium truncate">{name}</span>
            <span className="block text-[.7rem] text-slate-400 capitalize">{admin.role}</span>
          </span>
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600">
            {I('M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1')}Sign out
          </button>
        </form>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-2"><img src="/assets/icons/logo.svg" alt="" className="size-7" /><span className="text-sm font-extrabold">SJFB Admin</span></Link>
        <button type="button" onClick={() => setOpen(true)} className="size-9 rounded-lg border border-slate-200 flex items-center justify-center" aria-label="Open menu">
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
        </button>
      </header>
      {open && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
