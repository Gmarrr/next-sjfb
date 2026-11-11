import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HeroBg from '@/components/sustainability/HeroBg';
import RichTitle from '@/components/ui/RichTitle';
import { getContent } from '@/lib/content/get';
import { mediaUrl } from '@/lib/supabase';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Sustainability',
  description:
    'St. Joseph Fish Brokerage Inc. is committed to responsible fish brokerage, sustainable seafood practices, supporting Filipino fishing communities, and ethical operations across Philippine fish ports.',
  alternates: { canonical: '/sustainability' },
};

// Card styling + icons stay fixed per position (1–4); the text is editable.
const PILLAR_STYLE = [
  { href: '#responsible-brokerage', mod: '--blue', ibg: 'bg-blue-50', ic: 'text-blue-600', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { href: '#people-workplace', mod: '--green', ibg: 'bg-emerald-50', ic: 'text-emerald-600', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '#community-livelihoods', mod: '--teal', ibg: 'bg-teal-50', ic: 'text-teal-600', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { href: '#environmental-responsibility', mod: '--orange', ibg: 'bg-orange-50', ic: 'text-orange-600', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
];
const ENV_STYLE = [
  { ibg: 'bg-blue-50', ic: 'text-blue-600', path: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
  { ibg: 'bg-green-50', ic: 'text-green-600', path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { ibg: 'bg-teal-50', ic: 'text-teal-600', path: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064' },
  { ibg: 'bg-orange-50', ic: 'text-orange-600', path: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707' },
];

type Item = { title: string; desc: string };

const CheckList = ({ items }: { items: Item[] }) => (
  <div className="space-y-3">
    {items.map((it) => (
      <div key={it.title} className="check-item">
        <div className="check-dot"><svg className="size-3" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></div>
        <p className="text-sm text-gray-600"><strong className="text-gray-800">{it.title}</strong> — {it.desc}</p>
      </div>
    ))}
  </div>
);

const Photo = ({ src, alt, side }: { src: string; alt: string; side: 'r' | 'l' }) => (
  <div className={`img-zoom img-shadow-${side} aspect-[4/3]`} data-aos={side === 'r' ? 'fade-right' : 'fade-left'}>
    <img src={mediaUrl(src)} alt={alt} loading="lazy" />
  </div>
);

// Ported from sustainability.php — all text/images from Admin → Page Content → Sustainability.
export default async function SustainabilityPage() {
  const c = await getContent('sustainability');

  return (
    <>
      <div className="px-4"><Breadcrumbs items={[{ label: 'Sustainability', href: '/sustainability' }]} /></div>

      {/* HERO */}
      <section className="sustain-hero">
        <HeroBg image={mediaUrl(c.heroImage)} />
        <div className="sustain-hero__overlay" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-white">
          <div data-aos="fade-up" data-aos-duration="800">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-300 mb-4">{c.heroEyebrow}</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
              <RichTitle text={c.heroTitle} hl="not-italic text-emerald-300" />
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">{c.heroText}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#pillars" className="py-3 px-5 inline-flex items-center gap-2 rounded-xl bg-white text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-all hover:-translate-y-0.5 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" /></svg>
                Explore Our Commitments
              </a>
              <Link href="/contact" className="py-3 px-5 inline-flex items-center gap-2 rounded-xl border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5">Partner With Us</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
          <span className="section-eyebrow justify-center">{c.introEyebrow}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{c.introTitle}</h2>
          <div className="rich-text strong-orange text-lg text-gray-600 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: c.introText }} />
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-eyebrow justify-center">{c.pillarsEyebrow}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">{c.pillarsTitle}</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">{c.pillarsText}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.pillars.slice(0, 4).map((p, i) => {
              const st = PILLAR_STYLE[i];
              return (
                <a key={p.title} href={st.href} className={`pillar-card pillar-card${st.mod} block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group`} data-aos="fade-up" data-aos-delay={i * 100}>
                  <div className={`size-16 ${st.ibg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                    <svg className={`size-7 ${st.ic}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={st.icon} /></svg>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  <span className={`mt-4 inline-flex items-center ${st.ic} text-xs font-semibold gap-1`}>
                    Learn more <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* PILLAR 1 */}
      <section id="responsible-brokerage" className="deep-section py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Photo src={c.p1Image} alt={c.p1Title} side="r" />
            <div data-aos="fade-left" data-aos-delay="100">
              <div className="relative">
                <div className="deep-num">01</div>
                <span className="section-eyebrow">Pillar One</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{c.p1Title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{c.p1Text}</p>
                <CheckList items={c.p1Items} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 2 */}
      <section id="people-workplace" className="deep-section py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right" className="relative">
              <div className="deep-num">02</div>
              <span className="section-eyebrow">Pillar Two</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{c.p2Title}</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{c.p2Text}</p>
              <div className="space-y-6">
                {c.p2Items.map((it) => (
                  <div key={it.title} className="timeline-item">
                    <div className="timeline-dot" />
                    <h4 className="font-semibold text-gray-900 mb-1">{it.title}</h4>
                    <p className="text-sm text-gray-500">{it.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <Photo src={c.p2Image} alt={c.p2Title} side="l" />
          </div>
        </div>
      </section>

      {/* PILLAR 3 */}
      <section id="community-livelihoods" className="deep-section py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <Photo src={c.p3Image} alt={c.p3Title} side="r" />
            <div data-aos="fade-left" data-aos-delay="100" className="relative">
              <div className="deep-num">03</div>
              <span className="section-eyebrow">Pillar Three</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{c.p3Title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{c.p3Text}</p>
              <CheckList items={c.p3Items} />
            </div>
          </div>
        </div>
      </section>

      {/* PILLAR 4 */}
      <section id="environmental-responsibility" className="deep-section py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right" className="relative">
              <div className="deep-num">04</div>
              <span className="section-eyebrow">Pillar Four</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">{c.p4Title}</h2>
              <p className="text-gray-600 leading-relaxed mb-6">{c.p4Text}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {c.p4Items.map((it, i) => {
                  const st = ENV_STYLE[i % ENV_STYLE.length];
                  return (
                    <div key={it.title} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                      <div className={`size-10 ${st.ibg} rounded-lg flex items-center justify-center mb-3`}>
                        <svg className={`size-5 ${st.ic}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={st.path} /></svg>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{it.title}</h4>
                      <p className="text-xs text-gray-500">{it.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Photo src={c.p4Image} alt={c.p4Title} side="l" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="cta-bg" style={{ backgroundImage: `url('${mediaUrl(c.ctaImage)}')` }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-300 block mb-4">{c.ctaEyebrow}</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">{c.ctaTitle}</h2>
          <p className="text-lg text-white/75 mb-10 leading-relaxed">{c.ctaText}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="py-3 px-6 inline-flex items-center justify-center rounded-xl bg-white text-orange-600 font-semibold hover:bg-orange-50 transition-all hover:-translate-y-0.5 shadow-md">Explore Our Markets</Link>
            <Link href="/contact" className="py-3 px-6 inline-flex items-center justify-center rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5">Contact Us Today</Link>
          </div>
        </div>
      </section>
    </>
  );
}
