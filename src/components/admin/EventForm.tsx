'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveEvent, type EventInput } from '@/lib/admin/actions';
import { slugify } from '@/lib/admin/slug';
import { Card, Label, inputCls } from './ui';
import { ImageField, ImagesField } from './ImageField';
import RichTextEditor from './RichTextEditor';
import SaveBar from './SaveBar';
import { useSaveForm } from './useSaveForm';

export const EVENT_CATEGORIES = ['Company Celebration', 'Team Engagement', 'Business Review', 'Leadership Program', 'Seminar & Training', 'External / Industry', 'Health & Wellness'];

export default function EventForm({ initial }: { initial: EventInput }) {
  const router = useRouter();
  const isNew = !initial.event_id;
  const { data, set, setData, state, dirty, save } = useSaveForm<EventInput>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [seoOpen, setSeoOpen] = useState(Boolean(initial.event_meta_title || initial.event_meta_description || initial.event_meta_keywords));

  const onTitle = (v: string) => setData((d) => ({ ...d, event_title: v, event_slug: slugTouched ? d.event_slug : slugify(v) }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await save(saveEvent, data.event_status === 'published' ? 'Saved — live on the website.' : 'Saved as draft.');
    if (res.ok && isNew && res.id) { window.dispatchEvent(new Event('nav-progress:start')); } if (res.ok && isNew && res.id) router.replace(`/admin/events/${res.id}?created=1`);
    else if (res.ok) router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2 space-y-5">
          <Card title="Basic information">
            <div>
              <Label htmlFor="title" required>Event title</Label>
              <input id="title" className={inputCls} required value={data.event_title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Team Building 2026" />
            </div>
            <div>
              <Label htmlFor="slug" required help="The web address: /events/your-slug">URL slug</Label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 focus-within:border-orange-500 focus-within:ring-[3px] focus-within:ring-orange-500/10">
                <span className="pl-3 text-xs text-slate-400 whitespace-nowrap">/events/</span>
                <input id="slug" className="flex-1 bg-transparent py-2 pr-3 text-sm focus:outline-none" required value={data.event_slug} onChange={(e) => { setSlugTouched(true); set('event_slug', slugify(e.target.value)); }} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cat">Category</Label>
                <select id="cat" className={inputCls} value={data.event_category ?? ''} onChange={(e) => set('event_category', e.target.value)}>
                  <option value="">Select category</option>
                  {EVENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="aud">Audience</Label>
                <input id="aud" className={inputCls} value={data.event_audience ?? ''} onChange={(e) => set('event_audience', e.target.value)} placeholder="e.g. All Employees" />
              </div>
            </div>
            <div>
              <Label htmlFor="excerpt" help="One or two sentences shown on the event card.">Short summary</Label>
              <textarea id="excerpt" rows={2} className={inputCls} value={data.event_excerpt ?? ''} onChange={(e) => set('event_excerpt', e.target.value)} />
            </div>
          </Card>

          <Card title="Photos" description="The main photo is the banner and card image. Additional photos appear in the event's Photo Gallery.">
            <div>
              <Label>Main photo</Label>
              <ImageField folder="events" value={data.event_image ?? ''} onChange={(v) => set('event_image', v)} />
            </div>
            <div>
              <Label help="Select several photos at once. Use ‹ › to reorder.">Additional photos (gallery)</Label>
              <ImagesField folder="events/gallery" value={data.event_gallery} onChange={(v) => set('event_gallery', v)} />
            </div>
          </Card>

          <Card title="Full description">
            <RichTextEditor value={data.event_content ?? ''} onChange={(v) => set('event_content', v)} folder="events/content" />
          </Card>

          <Card>
            <button type="button" onClick={() => setSeoOpen(!seoOpen)} className="w-full flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>SEO settings <span className="font-normal text-slate-400">(optional)</span></span>
              <span className={`transition ${seoOpen ? 'rotate-180' : ''}`}>⌄</span>
            </button>
            {seoOpen && (
              <div className="space-y-4 pt-2">
                <div><Label htmlFor="mt">Meta title</Label><input id="mt" className={inputCls} value={data.event_meta_title ?? ''} onChange={(e) => set('event_meta_title', e.target.value)} placeholder="Leave empty to use the event title" /></div>
                <div><Label htmlFor="md">Meta description</Label><textarea id="md" rows={2} className={inputCls} value={data.event_meta_description ?? ''} onChange={(e) => set('event_meta_description', e.target.value)} placeholder="Leave empty to use the summary" /></div>
                <div><Label htmlFor="mk">Meta keywords</Label><input id="mk" className={inputCls} value={data.event_meta_keywords ?? ''} onChange={(e) => set('event_meta_keywords', e.target.value)} /></div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 lg:sticky lg:top-6">
          <Card title="Publishing">
            <div className="grid grid-cols-2 gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <button key={s} type="button" onClick={() => set('event_status', s)} className={`py-2 rounded-lg text-sm font-semibold border transition ${data.event_status === s ? (s === 'published' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-amber-50 border-amber-300 text-amber-700') : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                  {s === 'published' ? '✅ Published' : '📝 Draft'}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400">Drafts are hidden from the website.</p>
            {!isNew && data.event_status === 'published' && <a href={`/events/${initial.event_slug}`} target="_blank" rel="noopener" className="text-xs font-semibold text-orange-600 hover:underline">View on website ↗</a>}
          </Card>

          <Card title="Date & place">
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="d1" required>Start date</Label><input id="d1" type="date" required className={inputCls} value={data.event_date} onChange={(e) => set('event_date', e.target.value)} /></div>
              <div><Label htmlFor="d2">End date</Label><input id="d2" type="date" className={inputCls} value={data.event_end_date ?? ''} onChange={(e) => set('event_end_date', e.target.value)} /></div>
            </div>
            <div><Label htmlFor="time">Time</Label><input id="time" className={inputCls} value={data.event_time ?? ''} onChange={(e) => set('event_time', e.target.value)} placeholder="e.g. 2:00 PM – 4:00 PM" /></div>
            <div><Label htmlFor="loc">Location</Label><input id="loc" className={inputCls} value={data.event_location ?? ''} onChange={(e) => set('event_location', e.target.value)} placeholder="e.g. Navotas Main Office" /></div>
            <div><Label htmlFor="addr">Full address</Label><input id="addr" className={inputCls} value={data.event_address ?? ''} onChange={(e) => set('event_address', e.target.value)} /></div>
          </Card>

          <Card title="RSVP" description="Shown only for upcoming events.">
            <div><Label htmlFor="rsvp">Registration link</Label><input id="rsvp" className={inputCls} value={data.event_rsvp_url ?? ''} onChange={(e) => set('event_rsvp_url', e.target.value)} placeholder="/contact or https://…" /></div>
            <div><Label htmlFor="rsvpd">RSVP deadline</Label><input id="rsvpd" type="date" className={inputCls} value={data.event_rsvp_deadline ?? ''} onChange={(e) => set('event_rsvp_deadline', e.target.value)} /></div>
          </Card>
        </div>
      </div>
      <SaveBar state={state} dirty={dirty} label={isNew ? 'Create event' : 'Save changes'} />
    </form>
  );
}
