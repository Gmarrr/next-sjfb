import Link from 'next/link';

// Ported from components/history.php ("Shop seafood" button replaced with "Our Services").
const PILLS = ['40+ Years Experience', 'Navotas · Malabon · Lucena · Davao', '26 Stalls', 'Fresh produced Seafood'];

export default function History() {
  return (
    <>
      {/* ═══════════════════════════════════════
             ABOUT HERO HEADER
        ═══════════════════════════════════════ */}
        <div className="relative overflow-hidden bg-white dot-grid">

          <div className="pointer-events-none absolute -top-24 -right-32 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,.11)_0%,transparent_70%)]" aria-hidden="true"></div>
          <div className="pointer-events-none absolute -bottom-16 -left-20 w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.08)_0%,transparent_70%)]" aria-hidden="true"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pb-12">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Left: copy */}
              <div data-aos="fade-right" data-aos-duration="700">

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.7rem] font-bold uppercase tracking-widest mb-5">
                  <span className="pulse-dot w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
                  Established 1979 · Philippines
                </div>

                <h1 className="ff-display text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight mb-5">
                  The <em className="text-grad not-italic">Story</em> Behind the<br />Philippines' Most Trusted<br />Fish Broker
                </h1>

                <p className="text-slate-500 leading-relaxed max-w-lg mb-8">
                  St. Joseph Fish Brokerage, Inc. (SJFB) has been connecting Filipino fishermen with buyers, traders, and markets for over four decades — built on integrity, hard work, and a deep love for the Philippine seafood industry.
                </p>

                {/* Quick facts pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {PILLS.map((p) => (
                    <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold">
                      <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                      {p}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-grad shadow-[0_4px_16px_rgba(249,115,22,.28)] hover:-translate-y-0.5 transition-all duration-200">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    Our Services
                  </Link>
                  <Link href="/contact" className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 hover:-translate-y-px transition-all duration-200">
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.98 3.4 2 2 0 0 1 3.94 1.01h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Right: floating photo collage */}
              <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[600px]" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">

                {/* decorative orbit ring, desktop only */}
                <div className="orbit-ring hidden lg:block w-[420px] h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true"></div>

                {/* Anchor photo */}
                <div className="float-wrap absolute top-0 right-0 w-[80%] h-[220px] sm:h-[260px] lg:h-[280px] z-20" style={{ animationDuration: '6.4s' }}>
                  <figure className="photo-card photo-slot w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[-2deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
                    <img src="/assets/images/contents/about_2.jpg" alt="About St. Joseph Fish Brokerage Inc. — Navotas Fish Port Complex" className="w-full h-full object-cover" loading="eager" />
                  </figure>
                </div>

                {/* Satellite: portrait, bottom-left, overlapping the anchor */}
                <div className="float-wrap absolute bottom-4 left-0 w-[58%] sm:w-[54%] h-[190px] sm:h-[230px] lg:h-[260px] z-10" style={{ animationDuration: '7.2s', animationDelay: '.6s' }}>
                  <figure className="photo-card photo-slot w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
                    <img src="/assets/images/contents/about_4.jpg" alt="Team member selecting fresh seafood" className="w-full h-full object-cover" loading="lazy" />
                  </figure>
                </div>

                {/* Satellite: small square, top-left, tucked behind the anchor's corner */}
                <div className="float-wrap absolute top-[-10px] left-[8%] w-[92px] h-[92px] sm:w-[120px] sm:h-[120px] z-30" style={{ animationDuration: '6.8s', animationDelay: '1.1s' }}>
                  <figure className="photo-card photo-slot w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_20px_45px_rgba(15,23,42,.16)] rotate-[-8deg] transition-transform duration-500 hover:rotate-0 hover:scale-110">
                    <img src="/assets/images/contents/about_1.jpg" alt="Close-up of fresh catch on ice" className="w-full h-full object-cover" loading="lazy" />
                  </figure>
                </div>

                {/* Satellite: small square, bottom-right */}
                <div className="float-wrap absolute bottom-0 right-[2%] w-[100px] h-[100px] sm:w-[136px] sm:h-[136px] z-30" style={{ animationDuration: '6.2s', animationDelay: '1.6s' }}>
                  <figure className="photo-card photo-slot w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_20px_45px_rgba(15,23,42,.16)] rotate-[7deg] transition-transform duration-500 hover:rotate-0 hover:scale-110">
                    <img src="/assets/images/contents/about_5.jpg" alt="Loading a delivery truck with seafood orders" className="w-full h-full object-cover" loading="lazy" />
                  </figure>
                </div>

                {/* Satellite: circular accent, mid-right, desktop/tablet only */}
                <div className="float-wrap absolute top-[40%] right-[-4%] w-[96px] h-[96px] z-20 hidden md:block" style={{ animationDuration: '7s', animationDelay: '.3s' }}>
                  <figure className="photo-card photo-slot w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-[0_20px_45px_rgba(15,23,42,.16)] transition-transform duration-500 hover:scale-110">
                    <img src="/assets/images/contents/about_3.jpg" alt="Staff member smiling at work" className="w-full h-full object-cover" loading="lazy" />
                  </figure>
                </div>

              </div>
            </div>

          </div>
        </div>
        {/* /hero */}

        {/* ═══════════════════════════════════════
             OUR STORY — HISTORY SECTION
        ═══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white dot-grid" id="ourstory-section">

          {/* Ghost year, sitting behind everything */}
          <div className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 select-none z-0" aria-hidden="true">
            <span className="story-ghost-year">1979</span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.7rem] font-bold uppercase tracking-widest mb-4" data-aos="fade-right" data-aos-duration="800">
              <span className="pulse-dot w-2 h-2 rounded-full bg-orange-500 shrink-0"></span>
              Our Story
            </div>

            <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-20 items-start">

              {/* Text column, laid out as a timeline: 1979 → Today */}
              <div className="relative pl-9 border-l-2 border-dashed border-orange-200" data-aos="fade-right" data-aos-duration="800">

                {/* Marker: 1979 */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-grad ring-4 ring-white shadow-[0_2px_8px_rgba(249,115,22,.4)]" aria-hidden="true"></div>
                <span className="ff-display italic text-orange-500 text-sm tracking-wide">1979</span>

                <h2 className="ff-display text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mt-2 mb-6">
                  A Legacy Built on <span className="text-grad">Hard Work</span>
                </h2>

                <p className="story-dropcap text-slate-600 leading-relaxed mb-5">
                  <span className="font-semibold text-slate-900">St. Joseph Fish Brokerage, Inc. (SJFB)</span> is a trusted fish brokerage and seafood trading company in the Philippines, with over four decades of industry experience. Operating in major fish ports such as Navotas Fish Port Complex, Malabon Bayan Market, Lucena Fish Port Complex, and Davao Fish Port Complex, SJFB provides reliable <Link href="/services" className="font-semibold text-orange-600 underline decoration-orange-200 underline-offset-2 hover:decoration-orange-500 transition-colors">fish brokerage services</Link> to traders, suppliers, and buyers nationwide.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Founded as a family-owned business and officially established in 1979, SJFB continues to grow through integrity, strong partnerships, and a deep commitment to the Philippine seafood industry.
                </p>

                {/* Marker: Today */}
                <div className="relative mt-12 pt-1">
                  <div className="absolute -left-[41px] top-2 w-4 h-4 rounded-full bg-white border-2 border-orange-400" aria-hidden="true"></div>
                  <span className="ff-display italic text-slate-400 text-sm tracking-wide">Today</span>
                  <p className="ff-display text-lg text-slate-900 font-semibold mt-1">
                    40+ years later — still hand-picking every batch ourselves.
                  </p>
                </div>
              </div>

              {/* Photo column, with a stamp badge instead of plain corner accents */}
              <div className="relative" data-aos="fade-left" data-aos-duration="800" data-aos-delay="100">

                <div className="absolute -top-7 -left-7 z-20 w-[92px] h-[92px] rounded-full border-2 border-dashed border-orange-400 bg-white flex items-center justify-center -rotate-12 shadow-[0_8px_20px_rgba(15,23,42,.1)]" aria-hidden="true">
                  <span className="ff-display text-[9.5px] font-bold uppercase tracking-wide text-orange-600 text-center leading-tight">
                    Est.<br />1979<br />Navotas
                  </span>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(249,115,22,.14),0_4px_16px_rgba(15,23,42,.07)] rotate-[1.5deg] transition-transform duration-500 hover:rotate-0 group">
                  <img src="/assets/images/contents/about_6.jpg" alt="St. Joseph Fish Brokerage stall at Navotas Fish Port Complex" loading="lazy" className="w-full h-[380px] object-cover block transition-transform duration-700 group-hover:scale-[1.04]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-orange-900/15 to-transparent"></div>
                </div>
              </div>

            </div>

          </div>
        </section>
        {/* /our story */}
    </>
  );
}
