import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Lightbox from '@/components/layout/Lightbox';
import EventCard from '@/components/events/EventCard';
import YearMarquee from '@/components/events/YearMarquee';
import SubscribeForm from '@/components/events/SubscribeForm';
import { getAnnouncementEvent, getExternalEvents, getPublishedEvents } from '@/lib/queries';
import { fmtLong, fmtMonthYear, todayManila } from '@/lib/format';
import { getContent } from '@/lib/content/get';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Events & Activities',
  description: 'Upcoming gatherings, past celebrations, and the moments that bring the St. Joseph Fish Brokerage family — and our industry community — together.',
  alternates: { canonical: '/events' },
};

const ACTIVITY_STYLE = [
  { bg: 'bg-teal-50', fg: 'text-teal-600', path: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4' },
  { bg: 'bg-blue-50', fg: 'text-blue-600', path: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 21a12.083 12.083 0 01-6.16-10.422L12 14z' },
  { bg: 'bg-orange-50', fg: 'text-orange-600', path: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 10-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
];

// Ported from event.php ("Life at St. Joseph")
export default async function EventsPage() {
  const today = todayManila();
  const [events, extEvents, ann, c] = await Promise.all([getPublishedEvents(6), getExternalEvents(3), getAnnouncementEvent(today), getContent('events_page')]);

  return (
    <>
      <Lightbox />
      <div className="px-4"><Breadcrumbs items={[{ label: 'Events', href: '/events' }]} alwaysShow /></div>

      {/* PAGE HERO */}
      <section id="page-hero" className="relative flex h-[clamp(220px,30vw,360px)] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-6 text-center">
        <div className="relative z-10 max-w-2xl" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold tracking-widest uppercase bg-orange-600 text-white mb-3">{c.heroBadge}</span>
          <h1 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-bold text-white leading-tight mb-3 drop-shadow-lg">{c.heroTitle}</h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-[42ch] mx-auto">
            {c.heroText}
          </p>
        </div>
      </section>

      {/* EVENTS */}
      <section className="py-20 bg-slate-50" id="upcoming-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="before:content-[''] before:block before:w-8 before:h-0.5 before:bg-orange-400 inline-flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.15em] text-orange-400">{c.eventsEyebrow}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">{c.eventsTitle}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{c.eventsText}</p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((e, idx) => <EventCard key={e.event_id} e={e} idx={idx} />)}
            </div>
          ) : (
            <div className="text-center py-16" data-aos="fade-up">
              <span className="inline-flex items-center justify-center size-16 rounded-full bg-orange-50 mb-4">
                <svg className="size-8 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </span>
              <h3 className="text-lg font-semibold text-gray-800">No events at the moment</h3>
              <p className="mt-2 text-sm text-gray-500">Check back soon or subscribe below for updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* COMPANY ACTIVITIES + EXTERNAL PARTICIPATION */}
      <section className="py-20 bg-slate-50" id="participation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div data-aos="fade-up">
              <span className="before:content-[''] before:block before:w-8 before:h-0.5 before:bg-orange-400 inline-flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.15em] text-orange-400">Internal Engagement</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">{c.activitiesTitle}</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {c.activitiesText}
              </p>
              <ul className="space-y-3">
                {c.activities.map((a, i) => {
                  const st = ACTIVITY_STYLE[i % ACTIVITY_STYLE.length];
                  return (
                    <li key={a.title} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                      <span className={`inline-flex items-center justify-center size-9 rounded-lg ${st.bg} ${st.fg} shrink-0`}>
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d={st.path} /></svg>
                      </span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{a.title}</p>
                        <p className="text-gray-500 text-sm">{a.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <span className="before:content-[''] before:block before:w-8 before:h-0.5 before:bg-orange-400 inline-flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.15em] text-orange-400">Industry Presence</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">{c.externalTitle}</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                {c.externalText}
              </p>
              {extEvents.length > 0 ? (
                <div className="space-y-4">
                  {extEvents.map((p) => (
                    <Link key={p.event_id} href={`/events/${p.event_slug}`} className="block bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-600">{p.event_category}</span>
                        <span className="text-xs text-gray-400">{fmtMonthYear(p.event_date)}</span>
                      </div>
                      <h3 className="font-display font-bold text-gray-900 mb-1">{p.event_title}</h3>
                      <p className="text-gray-500 text-sm">{p.event_excerpt ?? ''}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">Industry participation events will appear here.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {ann?.event_rsvp_deadline && (
        <section className="py-12 bg-white" id="announcements">
          <div className="max-w-4xl mx-auto px-6" data-aos="fade-up">
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <span className="inline-flex items-center justify-center size-10 rounded-full bg-amber-100 text-amber-600 shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </span>
              <div>
                <p className="font-bold text-gray-900 mb-1">Event Announcement</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Registration for <strong>{ann.event_title}</strong> closes <strong>{fmtLong(ann.event_rsvp_deadline)}</strong>.
                  Schedules are subject to change — please check this page or subscribe below for the latest updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY (MARQUEE) */}
      <section className="relative overflow-hidden bg-slate-50 py-20" id="gallery">
        <div className="pointer-events-none absolute -top-16 -right-20 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="before:content-[''] before:block before:w-8 before:h-0.5 before:bg-orange-400 inline-flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.15em] text-orange-400">Through the Years</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">{c.galleryTitle}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{c.galleryText}</p>
          </div>
        </div>
        <YearMarquee gallery={c.gallery} />
      </section>

      {/* CTA / SUBSCRIBE */}
      <section className="relative py-20 bg-amber-50 overflow-hidden border-y border-amber-100">
        <div className="absolute -top-16 left-4 text-[14rem] font-display text-orange-600/5 pointer-events-none select-none" aria-hidden="true">&ldquo;</div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center" data-aos="fade-up">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-4">{c.subscribeTitle}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {c.subscribeText}
          </p>
          <SubscribeForm />
          <p className="text-xs text-gray-400 mt-4">
            Or <Link href="/contact" className="text-orange-600 font-semibold hover:underline">contact us directly</Link> to RSVP for our next event.
          </p>
        </div>
      </section>
    </>
  );
}
