'use client';

import { useState } from 'react';

// Ported from components/core_values.php — desktop "stairs" + mobile accordion.
const CORE_VALUES = [
  { id: 'iam', key: 'I AM', value: 'Integrity', desc: 'Doing the right thing at all times, even when no one is watching. We uphold honesty and strong moral principles in every action we take, ensuring that our word is our bond in the global marketplace.' },
  { id: 'imakeithappen', key: 'I MAKE IT HAPPEN', value: 'Commitment', desc: 'We take ownership and responsibility to deliver results. Our dedication drives us to turn promises into reality, overcoming challenges with determination and perseverance.' },
  { id: 'biglove', key: 'BIG LOVE', value: 'Passion', desc: 'We pour our hearts into everything we do. This passion fuels our creativity, energy, and dedication to serving our customers and community with genuine care and enthusiasm.' },
  { id: 'powerofone', key: 'THE POWER OF ONE', value: 'Teamwork', desc: 'Every individual contributes to our collective success. We believe that one person can make a difference, and together, we can achieve extraordinary things through collaboration and teamwork.' },
  { id: 'livemark', key: 'I LIVE MY MARK', value: 'Excellence', desc: 'We strive to leave a positive legacy in everything we do. Our actions today create lasting impact for tomorrow, inspiring others through our example of excellence and integrity.' },
  { id: 'ican', key: 'I CAN', value: 'Trust', desc: 'We embrace a can-do attitude that turns challenges into opportunities. With confidence and capability, we believe in our ability to grow, adapt, and succeed in any situation.' },
];

const ICONS: Record<string, string> = {
  iam: 'M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3 M12 3v18 M3.5 12h17',
  imakeithappen: 'M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0 M12 7a5 5 0 1 0 5 5 M13 3.055a9 9 0 1 0 7.941 7.945 M15 6v3h3l3 -3h-3v-3l-3 3 M15 9l-3 3',
  biglove: 'M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572',
  powerofone: 'M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158 -3.245',
  livemark: 'M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0 M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1',
  ican: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0 M9 12l2 2l4 -4',
};

export default function CoreValues() {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);
  const cv = CORE_VALUES[active];

  return (
    <section className="relative overflow-hidden bg-orange-50 border-y border-orange-200" id="corevalues-section">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.7rem] font-bold uppercase tracking-widest mb-4">
            <span className="pulse-dot w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            What We Stand For
          </div>
          <h2 className="ff-display text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            Our <span className="text-grad">Core Values</span>
          </h2>
          <p className="text-slate-400 text-sm mt-3">The principles that guide every decision we make.</p>
        </div>

        {/* DESKTOP: Stair layout */}
        <div className="core-values-stairs grid lg:grid-cols-2 items-start gap-10 px-4">
          <div data-aos="fade-right">
            <div className="min-h-[220px]">
              <div key={cv.id}>
                <div className="mb-6">
                  <span className="inline-block bg-grad text-white text-[.68rem] font-bold px-3 py-1 rounded-full mb-3">{cv.value}</span>
                  <h3 className="ff-display text-4xl font-bold text-slate-900 leading-tight">{cv.key}</h3>
                </div>
                <p className="text-slate-500 leading-relaxed text-[.95rem] max-w-md">{cv.desc}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end w-full" data-aos="fade-left">
            <img src="/assets/icons/logo.svg" className="w-16 h-16 hover:scale-110 duration-200 mb-4" alt="St. Joseph Fish Brokerage Inc. Logo" />
            {CORE_VALUES.map((v, idx) => (
              <button key={v.id} type="button" onClick={() => setActive(idx)} className={`w-fit core-value-card cursor-pointer text-left ${idx === active ? 'active-card' : ''}`}>
                <div className="relative h-24">
                  <img src={`/assets/backdrops/corebg_${idx + 1}.png`} alt="" className={`h-full w-auto block transition-opacity duration-300 ${idx === active ? 'opacity-100' : 'opacity-40'}`} />
                  <div className="absolute inset-0 z-10 flex items-center justify-start ms-10">
                    <span className="text-slate-800 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[v.id]} /></svg>
                    </span>
                    <div className="ms-2.5">
                      <h4 className="font-bold text-base leading-tight uppercase text-slate-900 whitespace-nowrap">{v.key}</h4>
                      <p className="text-sm font-semibold text-orange-600 whitespace-nowrap">{v.value}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MOBILE: Accordion */}
        <div className="core-values-accordion">
          <div className="space-y-3">
            {CORE_VALUES.map((v, idx) => {
              const open = openMobile === idx;
              return (
                <div key={v.id} className={`bg-white rounded-2xl border transition-all duration-300 ${open ? 'border-orange-400 shadow-md' : 'border-orange-100'}`}>
                  <button type="button" onClick={() => setOpenMobile(open ? null : idx)} className="w-full px-5 py-4 text-left flex justify-between items-center group" aria-expanded={open}>
                    <div className="flex items-center gap-3">
                      <div className="bg-grad flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,.25)]">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[v.id]} /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase leading-none tracking-tight text-[.88rem]">{v.key}</h4>
                        <p className="text-xs font-bold text-orange-600 italic mt-0.5">{v.value}</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 transition-transform duration-300 shrink-0 ${open ? 'rotate-45 text-orange-600' : 'text-orange-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  {open && (
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-0 ml-14">
                        <p className="text-[.82rem] leading-relaxed text-slate-500 border-l-2 border-orange-200 pl-4">{v.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
