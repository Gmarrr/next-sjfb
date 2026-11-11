'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import RichTitle from '@/components/ui/RichTitle';

type HeroProps = { chip: string; eyebrow: string; title: string; text: string; poster: string; video: string };

// Ported from the index.php hero (full-bleed video with mute toggle).
export default function Hero({ chip, eyebrow, title, text, poster, video }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);

  // React doesn't reliably render the `muted` attribute, which some browsers require for autoplay.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => { /* autoplay blocked — poster stays visible */ });
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };

  const scrollToOps = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const t = document.getElementById('operations');
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' }); }
  };

  return (
    <section id="hero" role="banner" className="relative w-full h-[100svh] min-h-[560px] max-h-[900px] overflow-hidden bg-slate-900">
      {/* Poster fallback shown until video is ready */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${poster}')` }} />

      {!failed && video && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onCanPlayThrough={() => setReady(true)}
          onPlaying={() => setReady(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[1400ms] ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={video} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}

      {/* Cinematic overlays for text legibility */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-900/55 via-slate-900/15 to-slate-900/85" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-900/60 via-transparent to-transparent" />

      {/* Live chip, top-right */}
      <div className="hero-anim animate-fade-in-1 absolute z-10 top-5 sm:top-8 right-5 sm:right-12 lg:right-20">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white text-[.68rem] font-bold uppercase tracking-widest">
          <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
          {chip}
        </span>
      </div>

      {/* Hero content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end px-5 sm:px-12 lg:px-20 pb-14 sm:pb-20 lg:pb-24">
        <p className="hero-anim animate-fade-up-1 inline-flex items-center gap-2 text-[.7rem] font-bold uppercase tracking-widest text-orange-400 mb-4">
          {eyebrow}
        </p>

        <h1 className="hero-anim animate-fade-up-2 font-display font-bold text-white leading-[1.05] max-w-[16ch] text-[clamp(2.25rem,6vw,4.75rem)] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,.25)]">
          <RichTitle text={title} hl="text-orange-400" />
        </h1>

        <p className="hero-anim animate-fade-up-3 mt-5 text-[clamp(.9375rem,1.2vw,1.0625rem)] font-light text-white/70 max-w-[46ch] leading-relaxed">
          {text}
        </p>

        <div className="hero-anim animate-fade-up-4 mt-8 flex flex-wrap gap-3.5">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-grad-orange text-white text-sm font-semibold shadow-[0_4px_20px_rgba(249,115,22,.4)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(249,115,22,.5)] transition-all duration-200"
          >
            Our Company
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <a
            href="#operations"
            onClick={scrollToOps}
            className="inline-flex items-center gap-2 py-3.5 px-8 rounded-full bg-white/10 border border-white/25 backdrop-blur-sm text-white/85 text-sm font-medium hover:bg-white/[.16] hover:border-white/45 hover:text-white transition-all duration-200"
          >
            Our Operations
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-anim animate-fade-in-3 hidden sm:flex absolute z-10 bottom-7 right-5 sm:right-12 lg:right-20 flex-col items-center gap-2" aria-hidden="true">
        <span className="text-[.625rem] font-semibold uppercase tracking-[.18em] text-white/45 [writing-mode:vertical-lr]">Scroll</span>
        <div className="animate-scroll-pulse w-px h-10 bg-gradient-to-b from-orange-400 to-transparent" />
      </div>

      {/* Mute / unmute */}
      {!failed && video && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label="Toggle video sound"
          className="hero-anim animate-fade-in-2 absolute z-10 bottom-7 left-5 sm:left-12 lg:left-20 flex items-center gap-2 py-2 px-4 rounded-full bg-slate-900/50 border border-white/[.18] text-white/75 text-xs font-medium backdrop-blur-md cursor-pointer hover:text-white hover:border-white/40 hover:bg-slate-900/70 transition-all duration-200"
        >
          {muted ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
              <path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" className="shrink-0">
              <path d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-6.414-3H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
          <span className="hidden sm:inline">{muted ? 'Sound off' : 'Sound on'}</span>
        </button>
      )}
    </section>
  );
}
