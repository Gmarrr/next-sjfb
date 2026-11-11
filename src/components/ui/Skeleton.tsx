// Shimmering placeholder blocks used by every loading.tsx skeleton.
type Tone = 'light' | 'dark' | 'orange';
const toneCls = (t: Tone = 'light') => (t === 'dark' ? ' sk-dark' : t === 'orange' ? ' sk-orange' : '');

export function Sk({ className = '', tone }: { className?: string; tone?: Tone }) {
  return <div className={`sk${toneCls(tone)} ${className}`} aria-hidden="true" />;
}

/** A few lines of text, the last one shorter. */
export function SkLines({ lines = 3, className = '', tone, lineClass = 'h-3.5' }: { lines?: number; className?: string; tone?: Tone; lineClass?: string }) {
  return (
    <div className={`space-y-2.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Sk key={i} tone={tone} className={`${lineClass} ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

/** Screen-reader announcement + wrapper. */
export function SkPage({ children, label = 'Loading…' }: { children: React.ReactNode; label?: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}

/** Card with image + text (events, blogs). */
export function SkCard({ imageClass = 'h-48' }: { imageClass?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Sk className={`${imageClass} rounded-none`} />
      <div className="p-6 space-y-3">
        <Sk className="h-5 w-24 rounded-full" />
        <Sk className="h-5 w-4/5" />
        <SkLines lines={2} />
        <Sk className="h-4 w-28 mt-2" />
      </div>
    </div>
  );
}

/** Orange gradient page hero used on Services/Contact/Events. */
export function SkOrangeHero({ height = 'h-[clamp(220px,30vw,360px)]' }: { height?: string }) {
  return (
    <section className={`relative ${height} w-full bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex items-center justify-center px-6`}>
      <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <Sk tone="orange" className="h-6 w-36 rounded-full" />
        <Sk tone="orange" className="h-10 sm:h-12 w-3/4" />
        <Sk tone="orange" className="h-4 w-2/3" />
        <Sk tone="orange" className="h-4 w-1/2" />
      </div>
    </section>
  );
}

/** Centered section heading (eyebrow + title + text). */
export function SkHeading({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-3 mb-10 ${className}`}>
      <Sk className="h-4 w-32" />
      <Sk className="h-8 w-72 max-w-full" />
      <Sk className="h-4 w-96 max-w-full" />
    </div>
  );
}
