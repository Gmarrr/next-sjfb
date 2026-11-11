import Link from 'next/link';
import { FOOTER_LINKS } from '@/lib/site';
import { LegalLink } from './LegalModals';
import { telHref } from '@/components/ui/RichTitle';
import type { Content } from '@/lib/content/schema';

// Ported from components/footer.php (Shop link removed; Sustainability + Blogs added to Explore).
export default function Footer({ site }: { site: Content<'site'> }) {
  return (
    <>
      {/* Wave divider */}
      <div className="overflow-hidden leading-none -mb-px">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 block" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 C360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="#0F172A" />
        </svg>
      </div>

      <footer className="text-gray-400" style={{ backgroundColor: '#0F172A' }}>
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block hover:opacity-75 transition-opacity duration-200">
                <img src={site.logo} alt="St. Joseph Fish Brokerage Inc." className="h-16 w-auto" loading="lazy" />
              </Link>
              <p className="text-sm text-white/80 leading-relaxed max-w-xs">{site.tagline}</p>
              <div className="flex gap-2 mt-1">
                <a href={site.facebookUrl} target="_blank" rel="noopener" title="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v4h3v7h4v-7h3l1-4h-4v-2a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2h-3" /></svg>
                </a>
                <a href={site.tiktokUrl} target="_blank" rel="noopener" title="TikTok" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2v-11.5h4.083a6.005 6.005 0 0 0 4.917 4.917z" /></svg>
                </a>
                <a href={`mailto:${site.marketingEmail}`} title="Email us" className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-orange-600 hover:border-orange-600 hover:text-white hover:-translate-y-0.5 transition-all duration-200">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </a>
              </div>
            </div>

            {/* Explore */}
            <div>
              <h5 className="text-[0.7rem] font-bold uppercase tracking-widest text-orange-500 mb-4">Explore</h5>
              <nav className="flex flex-col gap-2">
                {FOOTER_LINKS.map((p) => (
                  <Link key={p.href} href={p.href} className="group flex items-center gap-1.5 text-sm text-white/80 hover:text-orange-400 transition-colors duration-150">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150"><path d="M9 18l6-6-6-6" /></svg>
                    {p.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-[0.7rem] font-bold uppercase tracking-widest text-orange-500 mb-4">Legal</h5>
              <nav className="flex flex-col gap-2">
                <LegalLink id="privacy">Privacy Policy</LegalLink>
                <LegalLink id="terms">Terms &amp; Conditions</LegalLink>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h5 className="text-[0.7rem] font-bold uppercase tracking-widest text-orange-500 mb-4">Get in Touch</h5>
              <div className="flex flex-col gap-3.5">
                <div className="flex gap-3 items-start text-sm leading-relaxed">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-orange-500 mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </span>
                  <p className="text-white/80">{site.address}</p>
                </div>
                <div className="flex gap-3 items-center text-sm">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-orange-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </span>
                  <a href={telHref(site.phone)} className="text-white/80 hover:text-orange-400 transition-colors duration-150">{site.phone}</a>
                </div>
                <div className="flex gap-3 items-center text-sm">
                  <span className="shrink-0 w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-orange-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </span>
                  <a href={`mailto:${site.email}`} className="text-white/80 hover:text-orange-400 transition-colors duration-150 break-all">{site.email}</a>
                </div>
                <div className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)] animate-pulse" />
                  {site.hours}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-white/50">© {new Date().getFullYear()} St. Joseph Fish Brokerage Inc. All rights reserved.</p>
            <p className="text-xs text-white/50">{site.footerNote}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
