import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import MarketTabs, { type MarketView } from '@/components/services/MarketTabs';
import { getMarkets } from '@/lib/queries';
import { mediaUrl } from '@/lib/supabase';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Services',
  description:
    'St. Joseph Fish Brokerage Inc. operates across Navotas Fish Port Complex, Malabon Fish Port, and Davao Toril — connecting fresh Philippine seafood from fishermen to buyers nationwide.',
  alternates: { canonical: '/services' },
  openGraph: { title: 'Services & Markets | St. Joseph Fish Brokerage Inc.', url: '/services' },
};

/** Extract the iframe src from a stored Google Maps embed (or accept a plain URL). */
function mapUrlFrom(embed: string | null): string {
  if (!embed) return '';
  const decoded = embed.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const m = decoded.match(/src=["']([^"']+)["']/);
  const url = m ? m[1] : decoded.trim();
  return /^https:\/\//.test(url) ? url : '';
}

const WHY: [string, string, string][] = [
  ['⚖️', 'Fair Pricing Always', 'We do not manipulate market prices. Fishermen and buyers both receive transparent, competitive rates on every transaction.'],
  ['🕐', '24-Hour Port Operations', 'Our Navotas and Malabon teams operate before dawn to receive fresh landings — so your stock arrives at peak freshness.'],
  ['📋', 'Full Documentation', 'Every lot comes with complete paperwork: origin, weight, price, and transport chain — traceable end to end.'],
  ['🇵🇭', 'Nationwide Reach', 'From Metro Manila to Mindanao, our network ensures consistent supply across the Philippine seafood ecosystem.'],
  ['🤝', 'Long-Term Relationships', 'Many of our partners have been with us for over a decade. Trust is the foundation of everything.'],
  ['📈', 'Volume Flexibility', "Whether you're ordering 20 kg or 2 tons, we accommodate all order sizes with equal care."],
];

export default async function ServicesPage() {
  const rows = await getMarkets();
  const markets: MarketView[] = rows.map((m) => ({
    key: m.market_key,
    name: m.market_name,
    locationShort: m.location_short ?? '',
    description: m.description ?? '',
    highlights: Array.isArray(m.highlights) ? m.highlights : [],
    stallCount: m.stall_count ?? 0,
    mainImage: mediaUrl(m.main_image),
    gallery: (Array.isArray(m.gallery_images) ? m.gallery_images : []).filter(Boolean).map((g) => mediaUrl(g)),
    mapUrl: mapUrlFrom(m.map_embed),
    accent: m.accent_color || '#ea580c',
    products: Array.isArray(m.products_available) ? m.products_available : [],
    team: (m.market_members ?? []).map((t) => ({ name: t.member_name, position: t.position ?? '', image: mediaUrl(t.image_url) })),
  }));

  return (
    <>
      <div className="px-4"><Breadcrumbs items={[{ label: 'Services', href: '/services' }]} /></div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-24 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400">
        <div className="hero-fish-pattern absolute inset-0" />
        <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div data-aos="fade-up" data-aos-duration="700">
            <span className="block mb-4 text-xs font-bold tracking-widest uppercase text-white">Our Footprint</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Servicing Markets<br /><em className="not-italic text-white">Across the Philippines</em>
            </h1>
            <p className="text-lg text-white/75 max-w-2xl mx-auto leading-relaxed mb-8">
              From the massive Navotas Fish Port in Metro Manila to the deep-sea tuna docks of Davao Toril, St. Joseph Fish Brokerage Inc. is where Filipino seafood moves — reliably, fairly, and freshly.
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-sm text-white/60">
              {[['🗺️', '4 Major Ports'], ['🏪', '26 Market Stalls'], ['🤝', '1000+ Fishing Partners']].map(([icon, label]) => (
                <span key={label} className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium">{icon} {label}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full block mt-12"><path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white" /></svg>
        </div>
      </section>

      {/* MARKET TABS + PANELS */}
      <section id="market-tabs" className="py-16 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6">
          <MarketTabs markets={markets} />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="before:content-[''] before:block before:w-6 before:h-0.5 before:bg-orange-600 inline-flex items-center justify-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.12em] text-orange-600">Why Partner With Us</span>
            <h2 className="font-display text-3xl font-bold text-gray-900">What Sets Us Apart</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map(([icon, title, desc]) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" data-aos="fade-up">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400">
        <div className="max-w-2xl mx-auto px-6 text-center text-white" data-aos="fade-up">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to source fresh Philippine seafood?</h2>
          <p className="text-white/70 mb-5 leading-relaxed">Contact our team at any of our markets or send us a message — we&apos;ll connect you with the right catch.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-white py-3 px-8 font-bold text-orange-600 shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-100">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
