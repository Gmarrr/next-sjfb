import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { mediaUrl } from '@/lib/supabase';
import { Badge, ButtonLink, EmptyState, PageHeader, Thumb } from '@/components/admin/ui';
import ListToolbar from '@/components/admin/ListToolbar';
import Pagination from '@/components/admin/Pagination';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { deleteEvent } from '@/lib/admin/actions';
import { fmtShort } from '@/lib/format';
import type { EventRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Events' };
const PER = 15;

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const { q, status, page: p } = await searchParams;
  const page = Math.max(1, Number(p) || 1);
  const { supabase } = await requireAdmin();

  let query = supabase.from('events').select('event_id, event_title, event_slug, event_status, event_date, event_category, event_image, event_gallery', { count: 'exact' });
  if (q) query = query.ilike('event_title', `%${q}%`);
  if (status) query = query.eq('event_status', status);
  const { data, count } = await query.order('event_date', { ascending: false }).range((page - 1) * PER, page * PER - 1);
  const events = (data ?? []) as EventRow[];

  return (
    <>
      <PageHeader title="Events" description="Company events and activities shown on the Events page." actions={<ButtonLink href="/admin/events/new">+ New event</ButtonLink>} />
      <ListToolbar placeholder="Search events…" statuses={[{ value: 'published', label: 'Published' }, { value: 'draft', label: 'Draft' }]} />
      {events.length === 0 ? (
        <EmptyState title={q || status ? 'No events match your filters' : 'No events yet'} text="Create your first event to show it on the website." action={<ButtonLink href="/admin/events/new">+ New event</ButtonLink>} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <tr><th className="px-4 py-3">Event</th><th className="px-4 py-3 hidden md:table-cell">Date</th><th className="px-4 py-3 hidden lg:table-cell">Photos</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.event_id} className="hover:bg-orange-50/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/events/${e.event_id}`} className="flex items-center gap-3 group">
                      <Thumb src={mediaUrl(e.event_image)} />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 group-hover:text-orange-600 truncate">{e.event_title}</p>
                        <p className="text-xs text-slate-400 truncate">{e.event_category ?? '—'} <span className="md:hidden">· {fmtShort(e.event_date)}</span></p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell whitespace-nowrap">{fmtShort(e.event_date)}</td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell">{(e.event_image ? 1 : 0) + (e.event_gallery?.length ?? 0)}</td>
                  <td className="px-4 py-3"><Badge value={e.event_status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {e.event_status === 'published' && <a href={`/events/${e.event_slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-slate-500 hover:text-slate-800">View</a>}
                      <Link href={`/admin/events/${e.event_id}`} className="text-xs font-semibold text-orange-600 hover:underline">Edit</Link>
                      <ConfirmButton small action={deleteEvent.bind(null, e.event_id)} confirm={`Delete "${e.event_title}"? This cannot be undone.`} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} total={count ?? 0} perPage={PER} base="/admin/events" params={{ q, status }} />
    </>
  );
}
