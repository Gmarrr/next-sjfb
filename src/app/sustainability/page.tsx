import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import HeroBg from '@/components/sustainability/HeroBg';

export const metadata: Metadata = {
  title: 'Sustainability',
  description:
    'St. Joseph Fish Brokerage Inc. is committed to responsible fish brokerage, sustainable seafood practices, supporting Filipino fishing communities, and ethical operations across Philippine fish ports.',
  alternates: { canonical: '/sustainability' },
  openGraph: { images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&q=80'], url: '/sustainability' },
};

const PILLARS = [
  { href: '#responsible-brokerage', mod: '--blue', ibg: 'bg-blue-50', ic: 'text-blue-600', lc: 'text-blue-600', title: 'Responsible Brokerage', desc: 'Ethical trading, regulatory compliance, and full traceability from catch to buyer.', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { href: '#people-workplace', mod: '--green', ibg: 'bg-emerald-50', ic: 'text-emerald-600', lc: 'text-emerald-600', title: 'People & Culture', desc: 'Fair wages, safe conditions, inclusive culture, and continuous employee growth.', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { href: '#community-livelihoods', mod: '--teal', ibg: 'bg-teal-50', ic: 'text-teal-600', lc: 'text-teal-600', title: 'Community & Livelihoods', desc: 'Direct support for fishing families, local suppliers, and coastal communities.', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
  { href: '#environmental-responsibility', mod: '--orange', ibg: 'bg-orange-50', ic: 'text-orange-600', lc: 'text-orange-600', title: 'Environmental Stewardship', desc: 'Mindful operations, waste reduction, and support for marine conservation efforts.', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
];

const BROKERAGE: [string, string][] = [
  ['Fair-price guarantee', 'fishermen receive market-competitive rates with no hidden deductions'],
  ['Full regulatory compliance', 'licensed under BFAR, FDA-registered, HACCP compliant'],
  ['Supply chain transparency', 'traceable documentation from catch origin to end buyer'],
  ['Anti-illegal fishing stance', 'we verify all suppliers and refuse products from illegal sources'],
];

const PEOPLE: [string, string][] = [
  ['Happy / Great Place to Work', 'PPE provided to all port-side staff; regular safety audits at all locations.'],
  ['Competitive Renumeration', 'Salaries regional minimum wage; 13th month, SSS, PhilHealth, Pag-IBIG covered.'],
  ['Career and Personal Development', 'In-house training, fisheries knowledge programs, and internal promotion pathways.'],
  ['Inclusive Culture', 'Equal opportunity employer — we value diversity in gender, background, and experience.'],
];

const COMMUNITY: [string, string][] = [
  ['Priority local sourcing', '95%+ of supply comes from registered small-scale and artisanal fishermen'],
  ['Advance payment program', 'helps fishermen cover fuel and equipment costs before catch'],
  ['Community scholarships', 'supporting education for children of long-term supplier families'],
  ['Market access programs', "connecting small suppliers to institutional buyers they couldn't reach alone"],
];

const ENVIRONMENT: [string, string, string, string, string][] = [
  ['bg-blue-50', 'text-blue-600', 'Closed Season Compliance', 'We halt trading of regulated species during mandated closed seasons.', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'],
  ['bg-green-50', 'text-green-600', 'Zero-Waste Drive', 'Fish scraps and unsold portions redirect to fishmeal processors — nothing wasted.', 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'],
  ['bg-teal-50', 'text-teal-600', 'Biodiversity Awareness', 'Staff trained to refuse endangered or undersize catches per BFAR guidelines.', 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064'],
  ['bg-orange-50', 'text-orange-600', 'Cold Chain Partnership', 'Optimized ice and refrigeration logistics reduce spoilage and energy use.', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707'],
];

// Ported from sustainability.php
export default function SustainabilityPage() {
  return (
    <>
      <div className="px-4"><Breadcrumbs items={[{ label: 'Sustainability', href: '/sustainability' }]} /></div>
      {/* HERO */}
      <section className="sustain-hero">
        <HeroBg />
        <div className="sustain-hero__overlay"></div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-white">
          <div data-aos="fade-up" data-aos-duration="800">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-emerald-300 mb-4">Our Commitment</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-3xl">
              Sustaining the Sea,<br /><em className="not-italic text-emerald-300">Sustaining Lives</em>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
              At St. Joseph Fish Brokerage Inc., sustainability isn't a policy — it's how we've always done business.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#pillars" className="py-3 px-5 inline-flex items-center gap-2 rounded-xl bg-white text-orange-600 font-semibold text-sm hover:bg-orange-50 transition-all hover:-translate-y-0.5 shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6" /></svg>
                Explore Our Commitments
              </a>
              <Link href="/contact" className="py-3 px-5 inline-flex items-center gap-2 rounded-xl border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition-all hover:-translate-y-0.5">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" style={{ width: '100%', display: 'block' }}>
            <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* INTRO + SDG BADGES */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
          <span className="section-eyebrow justify-center">Who We Are</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            More Than a Fish Broker — A Partner in the Philippine Seafood Ecosystem
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            With operations spanning <strong className="text-orange-600">Navotas</strong>, <strong className="text-orange-600">Malabon</strong>, <strong className="text-orange-600">Lucena</strong>, <strong className="text-orange-600">Davao</strong>, and growing, we serve as the critical link between hardworking Filipino fishermen and the buyers who depend on fresh, traceable seafood.
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section id="pillars" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <span className="section-eyebrow justify-center">Our Framework</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900">Four Pillars of Sustainable Practice</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Each pillar represents a core area where we measure, improve, and remain accountable.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p, i) => (
              <a key={p.href} href={p.href} className={`pillar-card pillar-card${p.mod} block bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group`} data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`size-16 ${p.ibg} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                  <svg className={`size-7 ${p.ic}`} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={p.icon} /></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                <span className={`mt-4 inline-flex items-center ${p.lc} text-xs font-semibold gap-1`}>
                  Learn more <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DEEP DIVE 1 */}
      <section id="responsible-brokerage" className="deep-section py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="img-zoom img-shadow-r aspect-[4/3]" data-aos="fade-right">
              <img src="/assets/images/contents/home_4.jpg" alt="St. Joseph Fish brokerage fish vessels" loading="lazy" />
            </div>
            <div data-aos="fade-left" data-aos-delay="100">
              <div className="relative">
                <div className="deep-num">01</div>
                <span className="section-eyebrow">Pillar One</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">Responsible Fish Brokerage</h2>
                <p className="text-gray-600 leading-relaxed mb-6">As a licensed fish broker, we ensure every transaction is fair, transparent, and legally compliant. Our reputation across three decades is built on integrity.</p>
                <div className="space-y-3">
                  {BROKERAGE.map(([t, d]) => (
                    <div key={t} className="check-item">
                      <div className="check-dot"><svg className="size-3" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></div>
                      <p className="text-sm text-gray-600"><strong className="text-gray-800">{t}</strong> — {d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEEP DIVE 2 */}
      <section id="people-workplace" className="deep-section py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right">
              <div className="deep-num">02</div>
              <span className="section-eyebrow">Pillar Two</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">People & Culture</h2>
              <p className="text-gray-600 leading-relaxed mb-8">Our people are the backbone of St. Joseph. Every team member is treated with dignity, compensated fairly, and given the tools to grow.</p>
              <div className="space-y-6">
                {PEOPLE.map(([t, d]) => (
                <div key={t} className="timeline-item">
                  <div className="timeline-dot" />
                  <h4 className="font-semibold text-gray-900 mb-1">{t}</h4>
                  <p className="text-sm text-gray-500">{d}</p>
                </div>
              ))}
              </div>
            </div>
            <div className="img-zoom img-shadow-l aspect-[4/3]" data-aos="fade-left">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="St. Joseph team" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* DEEP DIVE 3 */}
      <section id="community-livelihoods" className="deep-section py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="img-zoom img-shadow-r aspect-[4/3]" data-aos="fade-right">
              <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" alt="Filipino fishing community" loading="lazy" />
            </div>
            <div data-aos="fade-left" data-aos-delay="100">
              <div className="deep-num">03</div>
              <span className="section-eyebrow">Pillar Three</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">Community & Livelihoods</h2>
              <p className="text-gray-600 leading-relaxed mb-6">Fishing communities around Navotas, Malabon, Lucena and Davao aren't just our supply chain — they are our neighbors and partners.</p>
              <div className="space-y-3">
                {COMMUNITY.map(([t, d]) => (
                <div key={t} className="check-item" style={{ borderLeftColor: 'transparent' }}>
                  <div className="check-dot"><svg className="size-3" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg></div>
                  <p className="text-sm text-gray-600"><strong className="text-gray-800">{t}</strong> — {d}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEEP DIVE 4 */}
      <section id="environmental-responsibility" className="deep-section py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div data-aos="fade-right">
              <div className="deep-num">04</div>
              <span className="section-eyebrow">Pillar Four</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">Environmental Stewardship</h2>
              <p className="text-gray-600 leading-relaxed mb-6">The ocean is not a resource to exploit — it's a living system that sustains millions of Filipinos.</p>
              {/* Preline-style mini cards: bg-white rounded-xl border p-4 */}
              <div className="grid sm:grid-cols-2 gap-4">
                {ENVIRONMENT.map(([ibg, ic, title, desc, path]) => (
                <div key={title} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                  <div className={`size-10 ${ibg} rounded-lg flex items-center justify-center mb-3`}>
                    <svg className={`size-5 ${ic}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={path} /></svg>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
              </div>
            </div>
            <div className="img-zoom img-shadow-l aspect-[4/3]" data-aos="fade-left">
              <img src="https://www.undp.org/sites/g/files/zskgke326/files/2024-11/ecothailand.jpg" alt="Marine conservation" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="cta-bg"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white" data-aos="fade-up">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-300 block mb-4">Work With Us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">Building a Sustainable Future — Together</h2>
          <p className="text-lg text-white/75 mb-10 leading-relaxed">Whether you're a buyer, a cooperative, or a business partner — St. Joseph is ready.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services" className="py-3 px-6 inline-flex items-center justify-center rounded-xl bg-white text-orange-600 font-semibold hover:bg-orange-50 transition-all hover:-translate-y-0.5 shadow-md">Explore Our Markets</Link>
            <Link href="/contact" className="py-3 px-6 inline-flex items-center justify-center rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5">Contact Us Today</Link>
          </div>
        </div>
      </section>
    </>
  );
}
