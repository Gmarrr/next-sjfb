import type { Metadata } from 'next';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ContactTabs from '@/components/contact/ContactTabs';
import CareerPanel from '@/components/contact/CareerPanel';
import RichTitle, { telHref } from '@/components/ui/RichTitle';
import { getContent } from '@/lib/content/get';
import type { Content } from '@/lib/content/schema';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with St. Joseph Fish Brokerage Inc. — send us a general inquiry, request a quote for fresh Philippine seafood, or apply to join our team at Navotas, Malabon, or Davao Toril.',
  alternates: { canonical: '/contact' },
};

const LOC_COLORS: [string, string][] = [['#eff6ff', '#1a6fa8'], ['#f0fdfa', '#0d9488'], ['#fff7ed', '#ea580c'], ['#faf5ff', '#9333ea']];

function Sidebar({ c, marketingEmail }: { c: Content<'contact'>; marketingEmail: string }) {
  return (
    <>
      {/* Market Locations */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <svg className="size-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Our Market Locations
        </h4>
        {c.locations.map(({ name, address: addr, hours }, i) => {
          const [bg, color] = LOC_COLORS[i % LOC_COLORS.length];
          return (
          <div key={name} className={`flex gap-3 ${i < c.locations.length - 1 ? 'pb-3 mb-3 border-b border-gray-50' : ''}`}>
            <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <svg className="size-4" style={{ color }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-900">{name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{addr}</p>
              <p className="text-xs text-gray-400">{hours}</p>
            </div>
          </div>
          );
        })}
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
          <svg className="size-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          Get in Touch Directly
        </h4>
        <div className="space-y-3 text-sm">
          <a href={`mailto:${marketingEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
            <svg className="size-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            {marketingEmail}
          </a>
          <a href={telHref(c.phone)} className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
            <svg className="size-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {c.phone}
          </a>
          <a href={c.facebookUrl} target="_blank" rel="noopener" className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
            <svg className="size-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            Facebook Page
          </a>
        </div>
      </div>

      {/* Response Times */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 p-5 shadow-sm">
        <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
          <svg className="size-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Response Times
        </h4>
        <div className="space-y-2 text-xs">
          {c.responseTimes.map(({ label, time }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-white/90">{label}</span>
              <span className="font-semibold text-white/90">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Ported from contact.php
export default async function ContactPage() {
  const [c, site] = await Promise.all([getContent('contact'), getContent('site')]);
  return (
    <>
      <div className="px-4"><Breadcrumbs items={[{ label: 'Contact', href: '/contact' }]} /></div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-6 pt-20 pb-20 md:pt-28 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,.05)_0%,transparent_40%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,.04)_0%,transparent_40%)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <div data-aos="fade-up" data-aos-duration="700">
            <span className="block mb-4 text-xs font-bold tracking-widest uppercase text-white">{c.heroEyebrow}</span>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-5">
              <RichTitle text={c.heroTitle} hl="text-amber-100" />
            </h1>
            <p className="text-lg text-white/75 leading-relaxed max-w-xl mx-auto">
              {c.heroText}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="block w-full"><path d="M0,20 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f9fafb" /></svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <ContactTabs careerPanel={<CareerPanel c={c} hrEmail={site.hrEmail} />} sidebar={<Sidebar c={c} marketingEmail={site.marketingEmail} />} perks={c.perks} formTitle={c.formTitle} formText={c.formText} />
        </div>
      </section>
    </>
  );
}
