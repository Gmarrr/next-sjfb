'use client';

import { Fragment, useRef, useState } from 'react';

// Ported from components/photo_mosaic.php — rows of photos with draggable dividers.
const ROWS: [number, number][][] = [
  [[7, 38], [8, 32], [9, 30]],
  [[10, 55], [11, 45]],
  [[12, 34], [13, 33], [14, 33]],
  [[15, 50], [16, 50]],
];
const MIN_PANEL_PX = 70;

function SplitterRow({ panels, rowIndex }: { panels: [number, number][]; rowIndex: number }) {
  const [ratios, setRatios] = useState(panels.map(([, r]) => r));
  const rowRef = useRef<HTMLDivElement>(null);

  const startDrag = (handleIdx: number, clientX: number) => {
    const row = rowRef.current;
    if (!row) return;
    const handles = Array.from(row.querySelectorAll<HTMLElement>('.photo-splitter-handle'));
    const handlesWidth = handles.reduce((s, h) => s + h.getBoundingClientRect().width, 0);
    const free = row.getBoundingClientRect().width - handlesWidth;
    const pxPerRatio = free / ratios.reduce((a, b) => a + b, 0);
    const minRatio = MIN_PANEL_PX / pxPerRatio;
    const start = [...ratios];
    const a = handleIdx - 1, b = handleIdx;
    document.body.classList.add('select-none');

    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      let d = (x - clientX) / pxPerRatio;
      d = Math.min(start[b] - minRatio, Math.max(-(start[a] - minRatio), d));
      const next = [...start];
      next[a] = start[a] + d; next[b] = start[b] - d;
      setRatios(next);
      if (e.cancelable) e.preventDefault();
    };
    const onEnd = () => {
      document.body.classList.remove('select-none');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onEnd);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd);
  };

  const nudge = (handleIdx: number, dir: 1 | -1) => {
    const a = handleIdx - 1, b = handleIdx, step = 2;
    const minRatio = Math.min(ratios[a], ratios[b]) * 0.3;
    if (ratios[a] + dir * step < minRatio || ratios[b] - dir * step < minRatio) return;
    const next = [...ratios];
    next[a] += dir * step; next[b] -= dir * step;
    setRatios(next);
  };

  return (
    <div
      ref={rowRef}
      className="photo-splitter-row flex h-56 sm:h-72 lg:h-[26rem] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(249,115,22,.14),0_4px_16px_rgba(15,23,42,.07)]"
      data-aos="fade-up"
      data-aos-delay={rowIndex * 100}
    >
      {panels.map(([n], pi) => (
        <Fragment key={n}>
          {pi > 0 && (
            <div
              className="photo-splitter-handle relative flex-none w-3.5 sm:w-4 bg-white cursor-col-resize group z-10"
              role="separator"
              aria-orientation="vertical"
              tabIndex={0}
              onMouseDown={(e) => { e.preventDefault(); startDrag(pi, e.clientX); }}
              onTouchStart={(e) => startDrag(pi, e.touches[0].clientX)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') { nudge(pi, -1); e.preventDefault(); }
                if (e.key === 'ArrowRight') { nudge(pi, 1); e.preventDefault(); }
              }}
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-7 sm:h-8 rounded-md bg-white border border-orange-200 text-orange-500 shadow-sm group-hover:bg-orange-50 group-active:bg-orange-100 transition-colors">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" />
                </svg>
              </span>
            </div>
          )}
          <div className="photo-splitter-panel photo-slot relative overflow-hidden" style={{ flex: `${ratios[pi]} 1 0px` }}>
            <img
              src={`/assets/images/contents/about_${n}.jpg`}
              alt="Life at St. Joseph Fish Brokerage"
              loading="lazy"
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default function PhotoMosaic() {
  return (
    <section className="relative overflow-hidden bg-white dot-grid" id="mosaic-section">
      <div className="pointer-events-none absolute top-1/3 -right-24 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,.09)_0%,transparent_70%)]" aria-hidden="true" />
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-10" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200 text-orange-600 text-[.7rem] font-bold uppercase tracking-widest mb-4">
            <span className="pulse-dot w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            Behind the Scenes
          </div>
          <h2 className="ff-display text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
            A Look Inside <span className="text-grad">SJFB</span>
          </h2>
        </div>
        <div className="space-y-4 lg:space-y-5 mx-auto">
          {ROWS.map((row, ri) => <SplitterRow key={ri} panels={row} rowIndex={ri} />)}
        </div>
      </div>
    </section>
  );
}
