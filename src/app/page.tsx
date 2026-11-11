import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/home/Hero';
import Explore from '@/components/home/Explore';
import PortOperations, { type PortLocation } from '@/components/home/PortOperations';
import { getLatestBlogs, getMarkets } from '@/lib/queries';
import { mediaUrl } from '@/lib/supabase';
import { fmtShort, truncate } from '@/lib/format';

export const revalidate = 300; // refresh Supabase content every 5 minutes

export const metadata: Metadata = {
  title: { absolute: 'St. Joseph Fish Brokerage Inc. | Largest Fish Brokerage in the Philippines' },
  description:
    'St. Joseph Fish Brokerage Inc. is the largest fish brokerage in the Philippines, providing fresh seafood trading, wholesale supply, and nationwide sourcing services.',
  alternates: { canonical: '/' },
  openGraph: { title: 'St. Joseph Fish Brokerage Inc.', description: 'Professional fish brokerage services with excellence and integrity.', url: '/' },
};

const STATS: [string, string, string][] = [
  ['47+', 'Years in Operation', 'Since 1979'],
  ['1000+', 'Verified Fishermen', 'Direct network'],
  ['4', 'Port Locations', 'Luzon & Mindanao'],
  ['100K+++', 'Kilos Daily', 'Fresh, not frozen'],
];

export default async function HomePage() {
  const [blogs, markets] = await Promise.all([getLatestBlogs(3), getMarkets()]);

  const locs: PortLocation[] = markets.map((m) => ({
    tag: m.tag ?? '',
    name: m.market_name,
    region: m.location_short ?? '',
    desc: truncate(m.description, 140),
    image: mediaUrl(m.main_image) || '/assets/images/contents/home_3.jpg',
    link: `/services?market=${encodeURIComponent(m.market_key)}`,
  }));

  return (
    <>
      <Hero />

      {/* STATS STRIP */}
      <div className="bg-slate-900 border-b border-orange-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-orange-500/10">
            {STATS.map(([n, l, s]) => (
              <div key={l} className="py-7 px-5 sm:px-6">
                <div className="font-display bg-grad-orange bg-clip-text text-transparent text-3xl sm:text-4xl font-bold leading-none">{n}</div>
                <div className="text-white text-xs font-semibold tracking-wide mt-2">{l}</div>
                <div className="text-slate-500 text-[.6875rem] mt-0.5">{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EXPLORE / ABOUT */}
      <section className="relative overflow-hidden bg-gray-200" id="explore-more">
        <Explore />
      </section>

      {/* COMPANY OVERVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.7rem] font-bold uppercase tracking-widest mb-5">
            <span className="animate-pulse-dot w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            Company Overview
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            More Than a Fish Broker —<br />
            <span className="bg-grad-orange bg-clip-text text-transparent">A Partner in Philippine Seafood</span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            With over <strong className="text-orange-600">47 years</strong> of operations spanning{' '}
            <strong className="text-orange-600">Navotas</strong>, <strong className="text-orange-600">Malabon</strong>,{' '}
            <strong className="text-orange-600">Lucena</strong>, <strong className="text-orange-600">Davao</strong>,
            and growing, we serve as the critical link between hardworking Filipino fishermen and the buyers
            who depend on fresh, traceable seafood every day.
          </p>
        </div>
      </section>

      {/* OPERATIONS / LOCATIONS */}
      <PortOperations locs={locs} />

      {/* BLOG / NEWS */}
      {blogs.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10" data-aos="fade-up">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.68rem] font-bold uppercase tracking-widest mb-3">
                  <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  Latest Insights
                </span>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">Blogs / News &amp; Updates</h2>
              </div>
              <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                All Blogs
                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {blogs.map((blog, idx) => (
                <Link
                  key={blog.blog_id}
                  href={`/blogs/${blog.blog_slug}`}
                  className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={idx * 80}
                >
                  <div className="relative h-48 overflow-hidden flex-none">
                    {blog.blog_featured_image ? (
                      <img src={mediaUrl(blog.blog_featured_image)} alt={blog.blog_title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-grad-orange flex items-center justify-center">
                        <span className="text-white text-3xl font-bold font-display">SJ</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center py-1 px-3 rounded-full text-[.65rem] font-bold bg-white/90 text-orange-600">
                        {fmtShort(blog.blog_published_date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5">
                    <p className="text-xs font-semibold text-slate-400 mb-2">{blog.blog_author ?? 'SJFB Editorial'}</p>
                    <h3 className="font-display text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">{blog.blog_title}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{blog.blog_excerpt ?? ''}</p>
                    <div className="flex items-center gap-1 text-orange-600 font-semibold text-sm">
                      Read More
                      <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <div className="relative overflow-hidden shadow-lg" data-aos="fade-up">
        <img src="/assets/images/contents/hero_banner2.jpg" alt="St. Joseph Fish Brokerage operations" loading="lazy" className="absolute inset-0 w-full h-full object-cover z-0" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-7">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[.7rem] font-bold uppercase tracking-widest">
            <span className="animate-pulse-dot w-2 h-2 rounded-full bg-orange-400 shrink-0" />
            Partner With Us
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Ready to Work With the<br />
            <span className="bg-grad-orange bg-clip-text text-transparent">Philippines&rsquo; Largest Fish Broker?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/contact" className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-grad-orange rounded-full py-3.5 px-8 shadow-[0_4px_20px_rgba(249,115,22,.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(249,115,22,.5)] transition-all duration-200">
              Contact Our Team
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/10 border border-white/25 backdrop-blur-sm rounded-full py-3.5 px-7 hover:bg-white/20 transition-all duration-200">
              Company Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
