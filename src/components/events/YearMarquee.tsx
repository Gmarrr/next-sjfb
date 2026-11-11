import { mediaUrl } from '@/lib/supabase';

const ArrowRight = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>);
const ArrowLeft = () => (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5-7 7 7 7" /></svg>);

// Ported from components/company_events.php — one auto-scrolling row per year, alternating direction.
// Years/photos come from Admin → Page Content → Events Page → Photo gallery.
export default function YearMarquee({ gallery }: { gallery: { year: string; images: string[] }[] }) {
  return (
    <div id="company-events" className="py-4">
      {gallery.filter((g) => g.images?.length).map(({ year, images: raw }, index) => {
        const isRTL = index % 2 !== 0;
        const images = raw.map((src) => mediaUrl(src));
        return (
          <div key={year} data-aos="fade-up">
            <div className="flex flex-row items-center justify-between gap-3 max-w-[70rem] mb-3 mx-auto px-4">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-orange-600 shrink-0"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3z" /></svg>
                <h2 className="font-bold text-xl title-year font-display">Events / Activities {year}</h2>
              </div>
              <span className={`direction-badge ${isRTL ? 'rtl' : 'ltr'}`}>
                {isRTL ? <ArrowLeft /> : <ArrowRight />} {isRTL ? 'Right to Left' : 'Left to Right'}
              </span>
            </div>
            <div className={`marquee-wrapper ${isRTL ? 'marquee-rtl' : 'marquee-ltr'}`}>
              <div className="marquee-content">
                {/* two copies for a seamless infinite scroll; only the first set is in the lightbox group */}
                {[0, 1].map((copy) =>
                  images.map((src, i) => (
                    <div key={`${copy}-${i}`} className="marquee-item" aria-hidden={copy === 1 || undefined}>
                      <a {...(copy === 0 ? { 'data-fancybox': `gallery-${year}` } : { 'data-fancybox-trigger': `gallery-${year}`, 'data-fancybox-index': i, tabIndex: -1 })} href={src}>
                        <img src={src} alt={`St. Joseph Fish Brokerage Event ${year}`} loading="lazy" />
                      </a>
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
