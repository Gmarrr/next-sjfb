import { Sk, SkLines, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading event…">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4"><Sk className="h-4 w-64" /></div>
      <section className="relative w-full h-[clamp(260px,36vw,460px)] bg-slate-900">
        <div className="absolute bottom-8 left-5 sm:left-12 lg:left-16 space-y-3 w-[min(90%,40rem)]">
          <div className="flex gap-2"><Sk tone="dark" className="h-6 w-24 rounded-full" /><Sk tone="dark" className="h-6 w-36 rounded-full" /></div>
          <Sk tone="dark" className="h-10 w-full" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          <Sk className="h-4 w-28" /><Sk className="h-7 w-56" /><SkLines lines={6} />
          <Sk className="h-6 w-40 mt-8" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[0, 1, 2, 3].map((i) => <Sk key={i} className="aspect-[4/3] rounded-xl" />)}</div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-slate-50 p-6 space-y-4 h-fit">
          <Sk className="h-6 w-36" />
          {[0, 1, 2, 3].map((i) => <div key={i} className="flex gap-4"><Sk className="h-3 w-20" /><Sk className="h-3 flex-1" /></div>)}
          <Sk className="h-12 rounded-xl" />
        </div>
      </section>
    </SkPage>
  );
}
