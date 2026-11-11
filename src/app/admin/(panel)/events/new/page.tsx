import type { Metadata } from 'next';
import { PageHeader } from '@/components/admin/ui';
import EventForm from '@/components/admin/EventForm';
import { requireAdmin } from '@/lib/supabase/server';
import { todayManila } from '@/lib/format';

export const metadata: Metadata = { title: 'New event' };

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New event" back={{ href: '/admin/events', label: 'All events' }} />
      <EventForm initial={{ event_title: '', event_slug: '', event_status: 'draft', event_date: todayManila(), event_gallery: [], event_audience: 'All Employees' }} />
    </>
  );
}
