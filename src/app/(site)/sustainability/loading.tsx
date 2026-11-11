import { Sk, SkHeading, SkLines, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading Sustainability…">
      <section className="h-[90vh] min-h-[600px] bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6 space-y-5">
          <Sk tone="orange" className="h-4 w-36" />
          <Sk tone="orange" className="h-16 w-3/4" /><Sk tone="orange" className="h-16 w-1/2" />
          <Sk tone="orange" className="h-5 w-2/3" />
          <div className="flex gap-3"><Sk tone="orange" className="h-12 w-52 rounded-xl" /><Sk tone="orange" className="h-12 w-40 rounded-xl" /></div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20">
        <SkHeading />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (<div key={i} className="rounded-2xl border border-gray-100 p-6 space-y-3"><Sk className="size-16 rounded-2xl" /><Sk className="h-5 w-3/4" /><SkLines lines={3} /></div>))}
        </div>
      </section>
    </SkPage>
  );
}
