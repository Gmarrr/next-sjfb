import Link from 'next/link';

export default function Pagination({ page, total, perPage, base, params }: { page: number; total: number; perPage: number; base: string; params: Record<string, string | undefined> }) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]);
    if (p > 1) sp.set('page', String(p)); else sp.delete('page');
    return `${base}${sp.toString() ? `?${sp}` : ''}`;
  };
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <p className="text-slate-500">Page {page} of {pages} · {total} total</p>
      <div className="flex gap-1">
        {page > 1 && <Link href={href(page - 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">← Prev</Link>}
        {page < pages && <Link href={href(page + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50">Next →</Link>}
      </div>
    </div>
  );
}
