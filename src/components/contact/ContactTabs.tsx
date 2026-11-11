'use client';

import { useEffect, useState, type ReactNode } from 'react';
import InquiryForm from './InquiryForm';

const PERKS = ['Good minimum compensation + benefits', 'SSS, PhilHealth, Pag-IBIG covered', '13th month pay + performance bonuses', 'Career growth within our growing network', 'Stable, family-oriented workplace culture', 'Meals / allowances for port-side roles'];

// Tab switcher from contact.php (General Inquiry / Apply-Careers) + sidebar perks card.
export default function ContactTabs({ careerPanel, sidebar }: { careerPanel: ReactNode; sidebar: ReactNode }) {
  const [tab, setTab] = useState<'inquiry' | 'career'>('inquiry');

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tab');
    if (t === 'career' || t === 'panel-career') setTab('career');
  }, []);

  const tabCls = (active: boolean) =>
    `${active ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-500'} inline-flex items-center gap-2 rounded-xl py-3 px-5 text-sm font-semibold transition-all hover:text-gray-700 focus:outline-none`;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
      <div>
        <div className="mb-8" data-aos="fade-up">
          <p className="text-sm font-semibold text-gray-500 mb-3">What brings you here today?</p>
          <nav className="inline-flex gap-1 rounded-2xl bg-gray-100 p-1" role="tablist" aria-label="Contact reason">
            <button type="button" role="tab" aria-selected={tab === 'inquiry'} aria-controls="panel-inquiry" onClick={() => setTab('inquiry')} className={tabCls(tab === 'inquiry')}>
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              General Inquiry
            </button>
            <button type="button" role="tab" aria-selected={tab === 'career'} aria-controls="panel-career" onClick={() => setTab('career')} className={tabCls(tab === 'career')}>
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Apply / Careers
            </button>
          </nav>
        </div>

        <div id="panel-inquiry" role="tabpanel" hidden={tab !== 'inquiry'} data-aos="fade-up" data-aos-delay="100">
          <InquiryForm />
        </div>
        <div id="panel-career" role="tabpanel" hidden={tab !== 'career'}>
          {careerPanel}
        </div>
      </div>

      <div data-aos="fade-left" data-aos-delay="200" className="space-y-4">
        {sidebar}
        {tab === 'career' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
            <h4 className="text-sm font-bold text-amber-800 mb-3">⭐ Why Work With Us</h4>
            <ul className="space-y-1.5 text-xs text-amber-800">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2">
                  <svg className="size-3.5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
