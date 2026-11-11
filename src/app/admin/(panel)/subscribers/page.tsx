import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/supabase/server';
import { EmptyState, PageHeader, btnSecondary } from '@/components/admin/ui';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { deleteSubscriber } from '@/lib/admin/actions';
import { fmtShort } from '@/lib/format';

export const metadata: Metadata = { title: 'Subscribers' };
const PER = 50;

export default async function SubscribersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q, page: p } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const { supabase } = await requireAdmin();
  let query = supabase.from('subscribers').select('*', { count: 'exact' });
  if (q) query = query.ilike('email', `%${q}%`);
  const { data, count } = await query.order('created_at', { ascending: false }).range((page - 1) * PER, page * PER - 1);
  const rows = (data ?? []) as { id: number; email: string; source: string | null; created_at: string }[];
  return (
    <>
      <PageHeader title="Subscribers" description="People who signed up for event updates on the Events page." actions={<a href="/admin/export/subscribers" className={btnSecondary}>⬇ Export CSV</a>} />
      <ListToolbar placeholder="Search email…" />
      {rows.length === 0 ? <EmptyState title="No subscribers yet" /> : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"><tr><th className="px-4 py-3">Email</th><th className="px-4 py-3 hidden sm:table-cell">Signed up</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{r.email}</td>
                  <td className="px-4 py-2.5 text-slate-500 hidden sm:table-cell">{fmtShort(r.created_at)}</td>
                  <td className="px-4 py-2.5 text-right"><ConfirmButton small label="Remove" action={deleteSubscriber.bind(null, r.id)} confirm={`Remove ${r.email}?`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER} base="/admin/subscribers" params={{ q }} />
    </>
  );
}
