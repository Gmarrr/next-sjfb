import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { PageHeader } from '@/components/admin/ui';
import { SECTIONS } from '@/lib/content/schema';
import { fmtShort } from '@/lib/format';

export const metadata: Metadata = { title: 'Page Content' };

export default async function ContentIndexPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('site_content').select('key, updated_at');
  const updated = Object.fromEntries((data ?? []).map((r: { key: string; updated_at: string }) => [r.key, r.updated_at]));
  return (
    <>
      <PageHeader title="Page Content" description="Edit the text and photos on each page of the website. Events, blogs and ports have their own sections." />
      <div className="grid sm:grid-cols-2 gap-4">
        {SECTIONS.map((s) => (
          <Link key={s.key} href={`/admin/content/${s.key}`} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-orange-300 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-bold text-slate-900 group-hover:text-orange-600">{s.title}</h2>
              <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition">→</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">{s.description}</p>
            <p className="text-xs mt-3 text-slate-400">{updated[s.key] ? `Last edited ${fmtShort(updated[s.key])}` : 'Original text'}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
