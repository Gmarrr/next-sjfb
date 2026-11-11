import { Sk, SkLines, SkOrangeHero, SkPage } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <SkPage label="Loading Services…">
      <SkOrangeHero height="h-[420px]" />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex gap-2 border-b border-gray-200 mb-12 pb-1">{[0, 1, 2, 3].map((i) => <Sk key={i} className="h-10 w-44 rounded-t-lg" />)}</div>
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-3"><Sk className="aspect-video rounded-3xl" /><div className="flex gap-2">{[0, 1, 2].map((i) => <Sk key={i} className="size-16" />)}</div></div>
          <div className="space-y-4"><Sk className="h-4 w-32" /><Sk className="h-8 w-2/3" /><SkLines lines={4} />{[0, 1, 2].map((i) => <Sk key={i} className="h-11 rounded-xl" />)}</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">{[0, 1, 2, 3].map((i) => <Sk key={i} className="h-36 rounded-2xl" />)}</div>
      </section>
    </SkPage>
  );
}
