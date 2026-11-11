import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/server';
import { Card, PageHeader, btnPrimary } from '@/components/admin/ui';
import InquiryActions from '@/components/admin/InquiryActions';
import ConfirmButton from '@/components/admin/ConfirmButton';
import { deleteInquiry } from '@/lib/admin/actions';

export const metadata: Metadata = { title: 'Message' };

type Inquiry = { id: number; created_at: string; first_name: string; last_name: string; email: string; contact: string | null; sender_type: string | null; subject: string; message: string; market: string | null; status: string; attachments: { name: string; path: string }[] };

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('inquiries').select('*').eq('id', Number(id)).maybeSingle();
  if (!data) notFound();
  let m = data as Inquiry;

  // Opening a new message marks it as read
  if (m.status === 'new') {
    await supabase.from('inquiries').update({ status: 'read' }).eq('id', m.id);
    m = { ...m, status: 'read' };
  }

  const files = await Promise.all((m.attachments ?? []).map(async (a) => {
    const { data: signed } = await supabase.storage.from('inquiry-attachments').createSignedUrl(a.path, 60 * 60);
    return { ...a, url: signed?.signedUrl };
  }));

  const received = new Intl.DateTimeFormat('en-PH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Manila' }).format(new Date(m.created_at));
  const reply = `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}&body=${encodeURIComponent(`Hi ${m.first_name},\n\n\n\n—\nSt. Joseph Fish Brokerage Inc.\n\n> ${m.message.split('\n').join('\n> ')}`)}`;

  const rows: [string, string][] = [
    ['From', `${m.first_name} ${m.last_name}`], ['Email', m.email], ['Contact number', m.contact ?? '—'],
    ['I am a', m.sender_type ?? '—'], ['Preferred market', m.market ?? 'Any / Not sure'], ['Received', received],
  ];

  return (
    <>
      <PageHeader title={m.subject} back={{ href: '/admin/inquiries', label: 'All messages' }}
        actions={<ConfirmButton action={deleteInquiry.bind(null, m.id)} confirm="Delete this message and its attachments?" label="Delete" redirectTo="/admin/inquiries" />} />
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <Card title="Message" className="lg:col-span-2">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{m.message}</p>
          {files.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Attachments</p>
              <ul className="space-y-1.5">
                {files.map((f) => (
                  <li key={f.path}>{f.url ? <a href={f.url} target="_blank" rel="noopener" className="text-sm font-semibold text-orange-600 hover:underline">📎 {f.name}</a> : <span className="text-sm text-slate-400">📎 {f.name} (unavailable)</span>}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="pt-2"><a href={reply} className={btnPrimary}>Reply by email</a></div>
        </Card>
        <div className="space-y-5">
          <Card title="Status"><InquiryActions id={m.id} status={m.status} /></Card>
          <Card title="Sender">
            <dl className="space-y-2 text-sm">
              {rows.map(([k, v]) => (<div key={k}><dt className="text-xs text-slate-400">{k}</dt><dd className="text-slate-800 break-words capitalize-first">{v}</dd></div>))}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
