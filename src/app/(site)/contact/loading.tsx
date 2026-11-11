import { Sk, SkOrangeHero, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading Contact…">
      <SkOrangeHero height="h-[360px]" />
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_340px] gap-10">
          <div className="space-y-6">
            <Sk className="h-12 w-80 rounded-2xl" />
            <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
              <Sk className="h-6 w-48" /><Sk className="h-4 w-80 max-w-full" />
              <div className="grid sm:grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <Sk key={i} className="h-11" />)}</div>
              {[0, 1].map((i) => <Sk key={i} className="h-11" />)}
              <Sk className="h-28" /><Sk className="h-24 rounded-2xl" /><Sk className="h-12 rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">{['h-56', 'h-36', 'h-32'].map((h) => <Sk key={h} className={`${h} rounded-2xl`} />)}</div>
        </div>
      </section>
    </SkPage>
  );
}
