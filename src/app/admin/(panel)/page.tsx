import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { Badge, Card, PageHeader } from '@/components/admin/ui';
import { fmtShort } from '@/lib/format';

export const metadata: Metadata = { title: 'Dashboard' };

type Inquiry = { id: number; created_at: string; first_name: string; last_name: string; subject: string; status: string; sender_type: string | null };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const { supabase, admin } = await requireAdmin();

  const count = async (table: string, filter?: [string, string]) => {
    let q = supabase.from(table).select('*', { count: 'exact', head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [pubEvents, draftEvents, pubBlogs, draftBlogs, markets, newMsgs, subs, latest] = await Promise.all([
    count('events', ['event_status', 'published']), count('events', ['event_status', 'draft']),
    count('blogs', ['blog_status', 'published']), count('blogs', ['blog_status', 'draft']),
    count('markets'), count('inquiries', ['status', 'new']), count('subscribers'),
    supabase.from('inquiries').select('id, created_at, first_name, last_name, subject, status, sender_type').order('created_at', { ascending: false }).limit(6),
  ]);

  const stats = [
    { label: 'Published events', value: pubEvents, sub: `${draftEvents} draft`, href: '/admin/events' },
    { label: 'Published blogs', value: pubBlogs, sub: `${draftBlogs} draft`, href: '/admin/blogs' },
    { label: 'Ports', value: markets, sub: 'Services page', href: '/admin/markets' },
    { label: 'New messages', value: newMsgs, sub: 'from the contact form', href: '/admin/inquiries?status=new', hot: newMsgs > 0 },
    { label: 'Subscribers', value: subs, sub: 'event updates', href: '/admin/subscribers' },
  ];

  const quick = [
    { href: '/admin/events/new', label: 'New event', desc: 'Add photos, date and details' },
    { href: '/admin/blogs/new', label: 'New blog post', desc: 'Write news or an update' },
    { href: '/admin/content/home', label: 'Edit home page', desc: 'Hero, stats, photos' },
    { href: '/admin/content/site', label: 'Contact info & footer', desc: 'Phone, email, socials' },
  ];

  return (
    <>
      <PageHeader title={`Hello, ${admin.full_name || admin.email.split('@')[0]} 👋`} description="Here's what's happening on the website." />
      {denied && <div className="mb-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm p-3">That page is only available to the site owner.</div>}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`rounded-2xl border p-4 bg-white hover:-translate-y-0.5 hover:shadow-md transition ${s.hot ? 'border-orange-300 ring-2 ring-orange-100' : 'border-slate-200'}`}>
            <p className={`text-2xl font-extrabold ${s.hot ? 'text-orange-600' : 'text-slate-900'}`}>{s.value}</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">{s.label}</p>
            <p className="text-xs text-slate-400">{s.sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card title="Latest messages" className="lg:col-span-2">
          {(latest.data ?? []).length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet. Contact form submissions will appear here.</p>
          ) : (
            <ul className="divide-y divide-slate-100 -my-2">
              {(latest.data as Inquiry[]).map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/inquiries/${m.id}`} className="flex items-center gap-3 py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded-lg">
                    <span className={`size-2 rounded-full shrink-0 ${m.status === 'new' ? 'bg-orange-500' : 'bg-transparent'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm truncate ${m.status === 'new' ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{m.subject}</p>
                      <p className="text-xs text-slate-400 truncate">{m.first_name} {m.last_name} · {m.sender_type ?? '—'}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{fmtShort(m.created_at)}</span>
                    <Badge value={m.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/inquiries" className="inline-block text-sm font-semibold text-orange-600 hover:underline">View all messages →</Link>
        </Card>

        <Card title="Quick actions">
          <div className="grid gap-2">
            {quick.map((q) => (
              <Link key={q.href} href={q.href} className="rounded-xl border border-slate-200 px-4 py-3 hover:border-orange-300 hover:bg-orange-50/50 transition">
                <p className="text-sm font-semibold text-slate-900">{q.label}</p>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
