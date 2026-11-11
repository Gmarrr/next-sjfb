import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { Badge, EmptyState, PageHeader } from '@/components/admin/ui';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';
import { fmtShort } from '@/lib/format';

export const metadata: Metadata = { title: 'Messages' };
const PER = 20;

type Row = { id: number; created_at: string; first_name: string; last_name: string; email: string; subject: string; status: string; sender_type: string | null; market: string | null; attachments: unknown[] };

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const { q, status, page: p } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const { supabase } = await requireAdmin();
  let query = supabase.from('inquiries').select('id, created_at, first_name, last_name, email, subject, status, sender_type, market, attachments', { count: 'exact' });
  if (status) query = query.eq('status', status);
  else query = query.neq('status', 'archived');
  if (q) query = query.or(`subject.ilike.%${q.replace(/[,()]/g, ' ')}%,email.ilike.%${q.replace(/[,()]/g, ' ')}%,first_name.ilike.%${q.replace(/[,()]/g, ' ')}%,last_name.ilike.%${q.replace(/[,()]/g, ' ')}%`);
  const { data, count } = await query.order('created_at', { ascending: false }).range((page - 1) * PER, page * PER - 1);
  const rows = (data ?? []) as Row[];

  return (
    <>
      <PageHeader title="Messages" description="Submissions from the Contact page form." />
      <ListToolbar placeholder="Search name, email or subject…" statuses={[{ value: 'new', label: 'New' }, { value: 'read', label: 'Read' }, { value: 'replied', label: 'Replied' }, { value: 'archived', label: 'Archived' }]} />
      {rows.length === 0 ? (
        <EmptyState title="No messages here" text={status ? 'Try another filter.' : 'New contact form messages will appear here.'} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,.04),0_4px_16px_-8px_rgba(15,23,42,.08)] divide-y divide-slate-100 overflow-hidden">
          {rows.map((m) => (
            <Link key={m.id} href={`/admin/inquiries/${m.id}`} className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-50/40 ${m.status === 'new' ? 'bg-orange-50/20' : ''}`}>
              <span className={`size-2 rounded-full shrink-0 ${m.status === 'new' ? 'bg-orange-500' : 'bg-transparent'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm truncate ${m.status === 'new' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{m.subject}</p>
                <p className="text-xs text-slate-500 truncate">{m.first_name} {m.last_name} · {m.email}{m.sender_type ? ` · ${m.sender_type}` : ''}{m.attachments?.length ? ` · 📎 ${m.attachments.length}` : ''}</p>
              </div>
              <span className="text-xs text-slate-400 shrink-0 hidden sm:block">{fmtShort(m.created_at)}</span>
              <Badge value={m.status} />
            </Link>
          ))}
        </div>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER} base="/admin/inquiries" params={{ q, status }} />
    </>
  );
}
