'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { inputCls } from './ui';

/** Search box + status filter that write to the URL (?q=&status=). */
export default function ListToolbar({ statuses, placeholder = 'Search…' }: { statuses?: { value: string; label: string }[]; placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');
  const status = params.get('status') ?? '';

  const push = (next: Record<string, string>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
    sp.delete('page');
    router.replace(`${pathname}${sp.toString() ? `?${sp}` : ''}`);
  };

  useEffect(() => {
    const t = setTimeout(() => { if ((params.get('q') ?? '') !== q) push({ q }); }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        <input className={`${inputCls} pl-8`} value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} />
      </div>
      {statuses && (
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {[{ value: '', label: 'All' }, ...statuses].map((s) => (
            <button key={s.value} type="button" onClick={() => push({ status: s.value })} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${status === s.value ? 'bg-orange-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
