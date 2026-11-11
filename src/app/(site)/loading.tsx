import { Sk, SkLines, SkPage } from '@/components/ui/Skeleton';

// Home page skeleton (also the fallback for any public page without its own).
export default function Loading() {
  return (
    <SkPage label="Loading page…">
      <section className="relative w-full h-[100svh] min-h-[560px] max-h-[900px] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/40 to-slate-900" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-12 lg:px-20 pb-14 sm:pb-20 lg:pb-24 gap-4">
          <Sk tone="dark" className="h-3 w-48" />
          <Sk tone="dark" className="h-14 sm:h-16 w-72 sm:w-[28rem]" />
          <Sk tone="dark" className="h-14 sm:h-16 w-56 sm:w-80" />
          <Sk tone="dark" className="h-4 w-80 max-w-full mt-2" />
          <Sk tone="dark" className="h-4 w-64 max-w-full" />
          <div className="flex gap-3 mt-5"><Sk tone="dark" className="h-12 w-40 rounded-full" /><Sk tone="dark" className="h-12 w-40 rounded-full" /></div>
        </div>
      </section>
      <div className="bg-slate-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="py-7 px-5 space-y-2"><Sk tone="dark" className="h-9 w-24" /><Sk tone="dark" className="h-3 w-28" /><Sk tone="dark" className="h-2.5 w-20" /></div>
          ))}
        </div>
      </div>
      <section className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center gap-4">
        <Sk className="h-6 w-40 rounded-full" />
        <Sk className="h-9 w-2/3" />
        <SkLines lines={3} className="w-full max-w-2xl mt-2" />
      </section>
    </SkPage>
  );
}
