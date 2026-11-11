import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Lightbox from '@/components/layout/Lightbox';
import { getEventBySlug } from '@/lib/queries';
import { mediaUrl } from '@/lib/supabase';
import { fmtLong, isPastDate } from '@/lib/format';
import { SITE_URL } from '@/lib/site';

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Event Not Found', robots: { index: false } };
  const description = event.event_meta_description || event.event_excerpt || '';
  return {
    title: event.event_meta_title || event.event_title,
    description,
    keywords: event.event_meta_keywords || undefined,
    alternates: { canonical: `/events/${slug}` },
    openGraph: { type: 'article', title: event.event_title, description: event.event_excerpt ?? '', url: `/events/${slug}`, images: event.event_image ? [mediaUrl(event.event_image)] : undefined },
  };
}

/** Plain text → paragraphs; stored HTML from the rich text editor is rendered as-is. */
function renderContent(content: string) {
  const isPlain = !/<[a-z][\s\S]*>/i.test(content);
  if (!isPlain) return <div className="prose-event" dangerouslySetInnerHTML={{ __html: content }} />;
  return (
    <div className="prose-event">
      {content.trim().split(/\n\s*\n/).filter(Boolean).map((para, i) => (
        <p key={i}>{para.split('\n').map((line, j) => (<span key={j}>{j > 0 && <br />}{line}</span>))}</p>
      ))}
    </div>
  );
}

const GALLERY_VISIBLE = 8; // tiles shown before "+N more"

// Ported from events/single.php
export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const isPast = isPastDate(event.event_date);
  const gallery = (event.event_gallery ?? []).filter(Boolean).map((g) => mediaUrl(g));
  const heroImage = mediaUrl(event.event_image);
  const shareUrl = `${SITE_URL}/events/${slug}`;

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.event_title,
    startDate: event.event_date,
    endDate: event.event_end_date ?? event.event_date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: (event.event_location ?? '').includes('Online') ? 'https://schema.org/MixedEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: event.event_location || 'Philippines', address: event.event_address || 'Philippines' },
    image: [heroImage, ...gallery].filter(Boolean),
    description: event.event_excerpt ?? '',
    organizer: { '@type': 'Organization', name: 'St. Joseph Fish Brokerage Inc.', url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <Lightbox />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <Breadcrumbs alwaysShow items={[{ label: 'Events', href: '/events' }, { label: event.event_title }]} />
      </section>

      {/* EVENT HERO */}
      <section id="event-hero" className="relative w-full overflow-hidden bg-slate-900">
        {heroImage && <img src={heroImage} alt={event.event_title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {gallery.length > 0 && (
          <a href="#event-gallery" className="absolute z-20 top-4 right-4 sm:top-6 sm:right-6 inline-flex items-center gap-2 py-2 px-3.5 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur text-white text-xs font-semibold border border-white/20 transition-colors">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            {gallery.length} Photo{gallery.length > 1 ? 's' : ''}
          </a>
        )}

        <div className="relative z-10 h-full flex items-end px-5 pb-8 sm:px-12 lg:px-16">
          <div className="max-w-3xl" data-aos="fade-up">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold tracking-widest uppercase bg-orange-600 text-white">{isPast ? 'Past Event' : 'Upcoming'}</span>
              {event.event_category && (
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold tracking-widest uppercase bg-white/15 text-white border border-white/25 backdrop-blur">{event.event_category}</span>
              )}
            </div>
            <h1 className="font-display text-[clamp(1.5rem,4.5vw,3rem)] font-bold text-white leading-tight drop-shadow-lg">{event.event_title}</h1>
          </div>
        </div>
      </section>

      {/* DETAILS + SIDEBAR */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2" data-aos="fade-up">
              <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-orange-600 font-semibold mb-6 hover:underline">
                <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Back to Events
              </Link>

              <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              {renderContent(event.event_content || event.event_excerpt || '')}

              {/* Photo Gallery (additional photos) */}
              {gallery.length > 0 && (
                <div id="event-gallery" className="scroll-mt-28 mt-12">
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <h3 className="font-display text-xl font-bold text-gray-900">Photo Gallery</h3>
                    <span className="text-sm text-gray-400">{gallery.length} photo{gallery.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="event-gallery-grid">
                    {gallery.map((img, i) => {
                      const hidden = i >= GALLERY_VISIBLE;
                      const isLastVisible = i === GALLERY_VISIBLE - 1 && gallery.length > GALLERY_VISIBLE;
                      return (
                        <a
                          key={img + i}
                          data-fancybox="event-gallery"
                          data-caption={`${event.event_title} — photo ${i + 1} of ${gallery.length}`}
                          href={img}
                          className={`event-gallery-item${hidden ? ' hidden' : ''}`}
                        >
                          {!hidden && <img src={img} alt={`${event.event_title} photo ${i + 1}`} loading="lazy" />}
                          {isLastVisible && <span className="event-gallery-more">+{gallery.length - GALLERY_VISIBLE} more</span>}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-slate-50 rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Event Details</h3>
                <div className="space-y-3 mb-6">
                  <div className="nob-row"><span className="nob-label">Date</span><span className="nob-value">{fmtLong(event.event_date)}</span></div>
                  {event.event_end_date && event.event_end_date !== event.event_date && (
                    <div className="nob-row"><span className="nob-label">End Date</span><span className="nob-value">{fmtLong(event.event_end_date)}</span></div>
                  )}
                  {event.event_time && <div className="nob-row"><span className="nob-label">Time</span><span className="nob-value">{event.event_time}</span></div>}
                  {event.event_location && <div className="nob-row"><span className="nob-label">Location</span><span className="nob-value">{event.event_location}</span></div>}
                  {event.event_audience && <div className="nob-row"><span className="nob-label">Audience</span><span className="nob-value">{event.event_audience}</span></div>}
                  {!isPast && event.event_rsvp_deadline && (
                    <div className="nob-row"><span className="nob-label">RSVP By</span><span className="nob-value">{fmtLong(event.event_rsvp_deadline)}</span></div>
                  )}
                </div>

                {!isPast && event.event_rsvp_url ? (
                  <a href={event.event_rsvp_url} className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-sm font-bold transition-all duration-150 w-full">
                    RSVP / Register
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </a>
                ) : (
                  <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-3 border border-gray-100">
                    {isPast ? 'This event has concluded. Thanks to everyone who joined!' : 'Registration details coming soon.'}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">Share This Event</p>
                  <div className="flex items-center gap-2">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" aria-label="Share on Facebook" className="inline-flex items-center justify-center size-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-200 transition-colors">
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54v-2.89h2.54V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.991 22 12z" /></svg>
                    </a>
                    <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(event.event_title)}`} target="_blank" rel="noopener" aria-label="Share on X" className="inline-flex items-center justify-center size-9 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-orange-600 hover:border-orange-200 transition-colors">
                      <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* MORE EVENTS CTA */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
          <span className="section-eyebrow justify-center">More From St. Joseph</span>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">Browse Other Events</h2>
          <p className="text-gray-500 mb-6">Upcoming gatherings, past highlights, and team activities.</p>
          <Link href="/events" className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md">
            <span>View All Events &amp; Activities</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>
    </>
  );
}
