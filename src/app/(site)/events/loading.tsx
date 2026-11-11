import { Sk, SkCard, SkHeading, SkOrangeHero, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading events…">
      <SkOrangeHero />
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkHeading />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[0, 1, 2, 3, 4, 5].map((i) => <SkCard key={i} />)}</div>
        </div>
      </section>
      <section className="py-10 bg-slate-50 overflow-hidden">
        {[0, 1].map((r) => (
          <div key={r} className="mb-6">
            <Sk className="h-6 w-56 mx-auto mb-3" />
            <div className="flex gap-3 px-4">{[0, 1, 2, 3, 4, 5].map((i) => <Sk key={i} className="h-[150px] md:h-[210px] w-[220px] md:w-[300px] shrink-0 rounded-xl" />)}</div>
          </div>
        ))}
      </section>
    </SkPage>
  );
}
