import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/admin/ui';
import EventForm from '@/components/admin/EventForm';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { requireAdmin } from '@/lib/supabase/server';
import { deleteEvent, type EventInput } from '@/lib/admin/actions';
import type { EventRow } from '@/lib/types';

export const metadata: Metadata = { title: 'Edit event' };

const s = (v: string | null | undefined) => v ?? '';

export default async function EditEventPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const { created } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('events').select('*').eq('event_id', Number(id)).maybeSingle();
  if (!data) notFound();
  const e = data as EventRow;
  const initial: EventInput = {
    event_id: e.event_id, event_title: e.event_title, event_slug: e.event_slug, event_status: e.event_status,
    event_date: e.event_date, event_end_date: s(e.event_end_date), event_time: s(e.event_time), event_location: s(e.event_location),
    event_address: s(e.event_address), event_category: s(e.event_category), event_audience: s(e.event_audience), event_excerpt: s(e.event_excerpt),
    event_content: s(e.event_content), event_image: s(e.event_image), event_gallery: e.event_gallery ?? [], event_rsvp_url: s(e.event_rsvp_url),
    event_rsvp_deadline: s(e.event_rsvp_deadline), event_meta_title: s(e.event_meta_title), event_meta_description: s(e.event_meta_description), event_meta_keywords: s(e.event_meta_keywords),
  };
  return (
    <>
      <PageHeader
        title={e.event_title}
        back={{ href: '/admin/events', label: 'All events' }}
        actions={<ConfirmButton action={deleteEvent.bind(null, e.event_id)} confirm={`Delete "${e.event_title}"? This cannot be undone.`} label="Delete event" redirectTo="/admin/events" />}
      />
      {created && <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3">Event created.</div>}
      <EventForm key={e.event_id} initial={initial} />
    </>
  );
}
