'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export type MarketView = {
  key: string;
  name: string;
  locationShort: string;
  description: string;
  highlights: string[];
  stallCount: number;
  mainImage: string;
  gallery: string[];
  mapUrl: string;
  accent: string;
  products: string[];
  team: { name: string; position: string; image: string }[];
};

const ImagePlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100">
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="1">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="m3 9 4-4 4 4 4-6 6 9" /><circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  </div>
);

function MemberCard({ m }: { m: MarketView['team'][number] }) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-5 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5">
      {m.image && !broken ? (
        <img src={m.image} alt={m.name} loading="lazy" onError={() => setBroken(true)} className="mx-auto mb-3 block h-16 w-16 rounded-full border-[3px] border-gray-200 object-cover" />
      ) : (
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-xl font-bold text-blue-700">
          {m.name.charAt(0).toUpperCase()}
        </div>
      )}
      <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{m.position}</p>
    </div>
  );
}

function MarketPanel({ m }: { m: MarketView }) {
  const [main, setMain] = useState(m.mainImage);
  const [mainBroken, setMainBroken] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div role="tabpanel" id={`panel-${m.key}`} aria-labelledby={`tab-${m.key}`}>
      {/* Market Overview */}
      <div className="grid lg:grid-cols-2 gap-10 items-start mb-12">
        <div data-aos="fade-right">
          <div className="group relative rounded-3xl overflow-hidden aspect-video shadow-2xl shadow-black/15">
            {main && !mainBroken ? (
              <img src={main} alt={m.name} loading="lazy" onError={() => setMainBroken(true)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <ImagePlaceholder />
            )}
            {m.locationShort && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-xl px-3.5 py-2 text-xs font-bold shadow-lg">
                <svg className="size-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                {m.locationShort}
              </div>
            )}
            <div className="absolute bottom-4 right-4 rounded-xl bg-[#0c3d6e]/90 px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm">
              {m.stallCount} Stalls
            </div>
          </div>

          {m.gallery.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {m.gallery.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  loading="lazy"
                  onClick={() => { setMain(img); setMainBroken(false); }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition-all hover:border-orange-500 ${main === img ? 'border-orange-500' : 'border-transparent'}`}
                />
              ))}
            </div>
          )}

          {m.mapUrl && (
            <>
              <button type="button" onClick={() => setMapOpen(!mapOpen)} aria-expanded={mapOpen} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white py-2.5 px-4 text-sm font-semibold text-gray-600 transition-all hover:border-blue-400 hover:text-blue-600">
                {mapOpen ? (
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                )}
                <span>{mapOpen ? 'Hide Map' : 'View on Map'}</span>
              </button>
              {mapOpen && (
                <div className="w-full overflow-hidden mt-4 rounded-2xl">
                  <iframe src={m.mapUrl} className="w-full" height={300} style={{ border: 0, borderRadius: '.75rem' }} allowFullScreen loading="lazy" title={`${m.name} map`} />
                </div>
              )}
            </>
          )}
        </div>

        <div data-aos="fade-left">
          <span className="before:content-[''] before:block before:w-6 before:h-0.5 before:bg-orange-600 inline-flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-[0.12em] text-orange-600">{m.name}</span>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-4">{m.name}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{m.description}</p>
          {m.highlights.length > 0 && (
            <ul className="space-y-2">
              {m.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${m.accent}18` }}>
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: m.accent }}>
                    <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-gray-700">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Products available (names only — the online shop was removed) */}
      {m.products.length > 0 && (
        <div className="mb-12">
          <h3 className="font-bold text-gray-900 text-lg mb-4">🐟 Products Always Available</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {m.products.map((p) => (
              <div key={p} className="rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg hover:shadow-black/10">
                <div className="font-semibold text-gray-900 text-sm">{p}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-6">👥 Our Team at {m.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {m.team.map((member) => <MemberCard key={member.name + member.position} m={member} />)}
          <Link href="/contact?tab=career" className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 px-4 py-5 text-center transition-all hover:border-blue-400 hover:bg-blue-50">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-blue-100">
              <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24" className="transition-colors group-hover:stroke-blue-500"><path d="M12 4v16m8-8H4" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-400 transition-colors group-hover:text-blue-500">Join the Team</p>
            <p className="text-xs text-gray-300 mt-0.5">View openings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Ported from the services.php market tabs (deep link: /services?market=navotas).
export default function MarketTabs({ markets }: { markets: MarketView[] }) {
  const [activeKey, setActiveKey] = useState(markets[0]?.key ?? '');

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('market');
    if (key && markets.some((m) => m.key === key)) {
      setActiveKey(key);
      document.getElementById('market-tabs')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [markets]);

  if (markets.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="font-semibold text-gray-800">Market details are coming soon.</p>
        <p className="text-sm mt-1">Add markets in Supabase (table: <code>markets</code>) to show them here.</p>
      </div>
    );
  }

  const active = markets.find((m) => m.key === activeKey) ?? markets[0];

  return (
    <>
      <div className="border-b border-gray-200 mb-12 overflow-x-auto" data-aos="fade-up">
        <nav className="flex gap-1 min-w-max" role="tablist" aria-label="Markets" aria-orientation="horizontal">
          {markets.map((m) => {
            const isActive = m.key === active.key;
            return (
              <button
                key={m.key}
                type="button"
                id={`tab-${m.key}`}
                role="tab"
                aria-controls={`panel-${m.key}`}
                aria-selected={isActive}
                onClick={() => setActiveKey(m.key)}
                style={isActive ? { borderColor: m.accent, backgroundColor: `${m.accent}1a`, color: m.accent } : undefined}
                className={`${isActive ? 'font-bold' : 'border-transparent text-gray-500'} py-3 px-5 inline-flex items-center whitespace-nowrap border-b-2 rounded-t-lg text-sm font-semibold hover:text-gray-700 hover:bg-gray-50 focus:outline-none transition-all duration-200`}
              >
                {m.name}
              </button>
            );
          })}
        </nav>
      </div>
      <MarketPanel key={active.key} m={active} />
    </>
  );
}
