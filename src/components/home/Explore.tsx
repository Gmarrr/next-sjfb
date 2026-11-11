import RichTitle from '@/components/ui/RichTitle';
import { mediaUrl } from '@/lib/supabase';
import type { Content } from '@/lib/content/schema';

const ALTS = ["Fishermen sorting the day's catch at Navotas Fish Port", 'Brokers negotiating with buyers at the port', 'Wet market seafood display', 'Fresh catch laid out on ice', 'Buyer inspecting fresh seafood quality', 'Cold-chain delivery of seafood to buyers nationwide'];

// Ported from components/explore.php — text and photos come from Admin → Page Content → Home.
export default function Explore({ c }: { c: Content<'home'> }) {
  const photo = (i: number) => mediaUrl(c.explorePhotos[i % Math.max(c.explorePhotos.length, 1)] ?? '');
  const pills = (cls: string) =>
    c.explorePills.map((p) => (
      <div key={p.label} className={`flex items-center gap-2 rounded-full border border-orange-200 ${cls} pl-3 pr-4 py-2`}>
        <span className="ff-display text-sm font-bold text-grad">{p.value}</span>
        <span className="text-[.7rem] font-semibold text-slate-500 tracking-wide">{p.label}</span>
      </div>
    ));
  return (
    <>
      <section className="relative overflow-hidden bg-white dot-grid" aria-labelledby="network-heading" itemScope itemType="https://schema.org/Organization">

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-32 -right-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,.14)_0%,transparent_70%)]" aria-hidden="true"></div>
        <div className="pointer-events-none absolute -bottom-24 -left-28 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,.11)_0%,transparent_70%)]" aria-hidden="true"></div>
        <div className="pointer-events-none absolute top-1/3 left-1/4 w-[320px] h-[320px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,.06)_0%,transparent_70%)]" aria-hidden="true"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:py-24">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-10" data-aos="fade-up" data-aos-duration="600">
            <span className="w-8 h-px bg-orange-300"></span>
            <span className="text-xs font-bold tracking-[0.22em] text-orange-600 uppercase">{c.exploreEyebrow}</span>
            <span className="w-8 h-px bg-orange-300"></span>
          </div>

          {/* ── DESKTOP COLLAGE (photos scattered around centered heading) ── */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[820px]">

            {/* Decorative orbit rings behind everything */}
            <div className="orbit-ring w-[520px] h-[520px]" aria-hidden="true"></div>
            <div className="orbit-ring w-[680px] h-[680px] opacity-60" aria-hidden="true"></div>

            {/* Connective dotted line accents */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <line x1="24%" y1="18%" x2="41%" y2="34%" stroke="rgba(251,146,60,.3)" strokeWidth="1.5" strokeDasharray="4 5" />
              <line x1="76%" y1="20%" x2="59%" y2="35%" stroke="rgba(251,146,60,.3)" strokeWidth="1.5" strokeDasharray="4 5" />
              <line x1="22%" y1="82%" x2="40%" y2="65%" stroke="rgba(251,146,60,.3)" strokeWidth="1.5" strokeDasharray="4 5" />
              <line x1="78%" y1="80%" x2="60%" y2="64%" stroke="rgba(251,146,60,.3)" strokeWidth="1.5" strokeDasharray="4 5" />
            </svg>

            {/* LEFT COLUMN — stacked top → bottom with a fixed 28px gap between each */}

            {/* Photo 1 : top-left, LANDSCAPE — top: 0 → bottom: 220 */}
            <div className="float-wrap absolute top-0 left-[8%] w-[330px] h-[220px] z-10" style={{ animationDuration: '6.4s', animationDelay: '0s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[-4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-down" data-aos-duration="700" data-aos-delay="0">
                <img src={photo(0)} alt={ALTS[0]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* Photo 3 : mid-left, PORTRAIT — top: 248 (220 + 28 gap) → bottom: 548 */}
            <div className="float-wrap absolute top-[248px] left-[3%] w-[230px] h-[300px] z-10" style={{ animationDuration: '7.2s', animationDelay: '.8s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-right" data-aos-duration="700" data-aos-delay="150">
                <img src={photo(1)} alt={ALTS[1]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* Photo 5 : bottom-left, LANDSCAPE — top: 576 (548 + 28 gap) → bottom: 796; shifted further left so it clears the center stat pills */}
            <div className="float-wrap absolute top-[576px] left-[2%] w-[330px] h-[220px] z-10" style={{ animationDuration: '6.8s', animationDelay: '1.6s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[5deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-up" data-aos-duration="700" data-aos-delay="250">
                <img src={photo(2)} alt={ALTS[2]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* RIGHT COLUMN — stacked top → bottom with a fixed 28px gap between each */}

            {/* Photo 2 : top-right, LANDSCAPE — top: 0 → bottom: 220 */}
            <div className="float-wrap absolute top-0 right-[8%] w-[330px] h-[220px] z-10" style={{ animationDuration: '6.6s', animationDelay: '.4s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-down" data-aos-duration="700" data-aos-delay="100">
                <img src={photo(3)} alt={ALTS[3]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* Photo 4 : mid-right, PORTRAIT — top: 248 (220 + 28 gap) → bottom: 548 */}
            <div className="float-wrap absolute top-[248px] right-[3%] w-[230px] h-[300px] z-10" style={{ animationDuration: '7s', animationDelay: '1.2s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[-4deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-left" data-aos-duration="700" data-aos-delay="200">
                <img src={photo(4)} alt={ALTS[4]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* Photo 6 : bottom-right, LANDSCAPE — top: 576 (548 + 28 gap) → bottom: 796; kept clear of the center stat pills */}
            <div className="float-wrap absolute top-[576px] right-[2%] w-[330px] h-[220px] z-10" style={{ animationDuration: '6.2s', animationDelay: '2s' }}>
              <figure className="photo-card w-full h-full rounded-2xl overflow-hidden ring-4 ring-white shadow-[0_25px_60px_rgba(15,23,42,.18)] rotate-[-5deg] transition-transform duration-500 hover:rotate-0 hover:scale-105" data-aos="fade-up" data-aos-duration="700" data-aos-delay="300">
                <img src={photo(5)} alt={ALTS[5]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>

            {/* Center text block */}
            <div className="relative z-30 text-center max-w-lg px-6" data-aos="zoom-in" data-aos-duration="700" data-aos-delay="150">
              <div className="inline-flex mb-5 items-center justify-center size-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30 rotate-6">
                <svg className="size-7 text-white -rotate-6 icon icon-tabler icons-tabler-outline icon-tabler-fish-christianity" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M22 7s-5.646 10 -12.308 10c-3.226 .025 -6.194 -1.905 -7.692 -5c1.498 -3.095 4.466 -5.025 7.692 -5c6.662 0 12.308 10 12.308 10" />
                </svg>
              </div>
              <h2 id="network-heading" className="ff-display text-4xl xl:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                <RichTitle text={c.exploreTitle} />
              </h2>

              <div className="mt-8 inline-flex flex-wrap justify-center gap-2.5">
                {pills('bg-white/90 backdrop-blur-sm shadow-sm')}
              </div>
            </div>

          </div>

          {/* ── MOBILE / TABLET: heading first, then a scrollable photo strip ── */}
          <div className="lg:hidden">
            <div className="text-center max-w-xl mx-auto" data-aos="fade-up" data-aos-duration="700">
              <div className="inline-flex mb-4 items-center justify-center size-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/30 rotate-6">
                <svg className="size-6 text-white -rotate-6 icon icon-tabler icons-tabler-outline icon-tabler-fish-christianity" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M22 7s-5.646 10 -12.308 10c-3.226 .025 -6.194 -1.905 -7.692 -5c1.498 -3.095 4.466 -5.025 7.692 -5c6.662 0 12.308 10 12.308 10" />
                </svg>
              </div>
              <h2 className="ff-display text-3xl sm:text-4xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                <RichTitle text={c.exploreTitle.replace(/\n/g, ' ')} />
              </h2>
              <p className="mt-5 text-slate-500 leading-relaxed">
                {c.exploreText}
              </p>
              <div className="mt-7 inline-flex flex-wrap justify-center gap-2.5">
                {pills('bg-orange-50')}
              </div>
            </div>

            {/* snap-scroll photo strip */}
            <div className="mt-10 -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <figure className="snap-center shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={photo(0)} alt={ALTS[0]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
              <figure className="snap-center shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={photo(1)} alt={ALTS[1]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
              <figure className="snap-center shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={photo(2)} alt={ALTS[2]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
              <figure className="snap-center shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={photo(4)} alt={ALTS[4]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
              <figure className="snap-center shrink-0 w-56 h-72 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white">
                <img src={photo(5)} alt={ALTS[5]} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </figure>
            </div>
          </div>

        </div>
      </section>

      <p className="sr-only">Fish brokerage Philippines, fresh seafood supplier Philippines, wholesale fish distributor, seafood trading platform, Philippine fish market, buy fresh fish Philippines, seafood wholesaler Navotas, bulk fish supply restaurant.</p>
    </>
  );
}
