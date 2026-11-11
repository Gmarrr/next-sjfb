'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import RichTitle from '@/components/ui/RichTitle';

export type PortLocation = {
  tag: string;
  name: string;
  region: string;
  desc: string;
  image: string;
  link: string;
};

// Ported from components/port_operations.php — cards + image-splash modals.
export default function PortOperations({ locs, badge, title }: { locs: PortLocation[]; badge: string; title: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);

  const close = () => {
    setClosing(true);
    setTimeout(() => { setOpenIdx(null); setClosing(false); }, 200);
  };

  useEffect(() => {
    if (openIdx === null) return;
    document.body.classList.add('overflow-hidden');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('overflow-hidden'); document.removeEventListener('keydown', onKey); };
  }, [openIdx]);

  const loc = openIdx !== null ? locs[openIdx] : null;

  return (
    <>
      <section
        id="operations"
        className="relative overflow-hidden bg-slate-900 py-20 bg-[radial-gradient(circle,rgba(249,115,22,.05)_1px,transparent_1px)] bg-[length:30px_30px]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[.7rem] font-bold uppercase tracking-widest mb-4">
              <span className="animate-pulse-dot w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              {badge}
            </span>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-white">
              {locs.length || 4} <RichTitle text={title} hl="bg-grad-orange bg-clip-text text-transparent" />
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {locs.map((l, i) => (
              <button
                key={l.name + i}
                type="button"
                onClick={() => setOpenIdx(i)}
                aria-haspopup="dialog"
                className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-orange-500/30 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
                data-aos="fade-up"
                data-aos-delay={i * 70}
              >
                {l.tag && <span className="inline-block text-[.625rem] font-bold uppercase tracking-widest text-orange-400 mb-3">{l.tag}</span>}
                <h3 className="font-display text-lg font-bold text-white mb-0.5">{l.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mb-2">{l.region}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {loc && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 backdrop-blur-sm overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="port-modal-label"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div className={`port-modal-box ${closing ? 'closing' : ''} w-full max-w-xl mx-auto`}>
            <div className="flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-56 sm:h-72 object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/contents/home_4.jpg'; }}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                <button type="button" onClick={close} aria-label="Close" className="absolute top-3 end-3 flex items-center justify-center w-9 h-9 rounded-full bg-slate-900/70 border border-white/10 text-white hover:bg-slate-900/90 transition-colors">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
                {loc.tag && <span className="absolute bottom-3 start-4 inline-block text-[.625rem] font-bold uppercase tracking-widest text-orange-400">{loc.tag}</span>}
              </div>
              <div className="p-6">
                <h3 id="port-modal-label" className="font-display text-xl font-bold text-white mb-0.5">{loc.name}</h3>
                <p className="text-xs font-semibold text-slate-400 mb-3">{loc.region}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{loc.desc}</p>
              </div>
              <div className="flex justify-between items-center gap-x-2 py-3 px-6 border-t border-white/10">
                <button type="button" onClick={close} className="py-2 px-3 text-sm font-semibold rounded-lg text-slate-300 hover:bg-white/5 transition-colors">Close</button>
                <Link href={loc.link} className="py-2 px-4 text-sm font-semibold rounded-lg bg-grad-orange text-white hover:opacity-90 transition-opacity">
                  View Full Port Profile &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
